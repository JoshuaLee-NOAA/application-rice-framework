/**
 * Data Validation Module
 * Validates portfolio data quality and provides warnings/suggestions
 */

/**
 * Validate a single application's data
 */
export function validateApplication(app) {
  const errors = [];
  const warnings = [];
  const suggestions = [];
  
  const appName = app['Application'] || 'Unknown Application';
  
  // Required fields validation
  const requiredFields = [
    'Application', 'Program Name', 'Prod URL', 'Public Access?',
    'Technology Stack', 'Product Owner', 'Product Contact',
    'Development Org', 'Hosting Org', 'Number of Users', 'Purpose'
  ];
  
  requiredFields.forEach(field => {
    if (!app[field] || (typeof app[field] === 'string' && app[field].trim() === '')) {
      errors.push(`${appName}: Missing required field '${field}'`);
    }
  });
  
  // Purpose quality check
  const purpose = app['Purpose'] || '';
  if (purpose.length < 50) {
    warnings.push(`${appName}: Purpose is too short (${purpose.length} chars). Recommend 100+ characters for high confidence scoring.`);
  }
  
  // Quantitative data completeness
  const hasUserMetrics = app['User Metrics'] !== undefined;
  const hasMissionMetrics = app['Mission Metrics'] !== undefined;
  const hasResourceMetrics = app['Resource Metrics'] !== undefined;
  
  if (!hasUserMetrics && !hasMissionMetrics && !hasResourceMetrics) {
    warnings.push(`${appName}: No quantitative metrics provided. Using qualitative scoring (less accurate).`);
    suggestions.push(`${appName}: Add User Metrics, Mission Metrics, and Resource Metrics for better scoring accuracy.`);
  } else {
    // Partial quantitative data
    if (!hasUserMetrics) {
      suggestions.push(`${appName}: Add User Metrics (External Users, Internal Users, Geographic Scope) for more accurate Reach scoring.`);
    }
    if (!hasMissionMetrics) {
      suggestions.push(`${appName}: Add Mission Metrics (Business Criticality, Statutory Requirements) for more accurate Impact scoring.`);
    }
    if (!hasResourceMetrics) {
      suggestions.push(`${appName}: Add Resource Metrics (FTE, Annual Hosting Cost, Incidents) for more accurate Effort scoring.`);
    }
  }
  
  // Validate User Metrics if present
  if (hasUserMetrics) {
    const metrics = app['User Metrics'];
    const external = parseInt(metrics['External Users']) || 0;
    const internal = parseInt(metrics['Internal Users']) || 0;
    const total = parseInt(app['Number of Users']) || 0;
    const scope = metrics['Geographic Scope'];
    
    // Check user count consistency
    if (total > 0 && external + internal > 0) {
      const diff = Math.abs(total - (external + internal));
      if (diff > total * 0.1) {  // More than 10% difference
        warnings.push(`${appName}: User count mismatch. Total Users (${total}) doesn't match External (${external}) + Internal (${internal}) = ${external + internal}`);
      }
    }
    
    // Check geographic scope
    if (!scope || !['National', 'Regional', 'Local'].includes(scope)) {
      errors.push(`${appName}: Geographic Scope must be 'National', 'Regional', or 'Local'. Got: '${scope}'`);
    }
    
    // Check for zero users
    if (external === 0 && internal === 0) {
      warnings.push(`${appName}: User Metrics shows 0 total users. This seems unlikely for a production application.`);
    }
  }
  
  // Validate Mission Metrics if present
  if (hasMissionMetrics) {
    const metrics = app['Mission Metrics'];
    const tier = metrics['Business Criticality'];
    const rto = metrics['RTO (Recovery Time Objective)'];
    const mandates = metrics['Statutory Requirements'];
    
    // Check business tier
    if (!tier || !['Tier 1', 'Tier 2', 'Tier 3'].includes(tier)) {
      errors.push(`${appName}: Business Criticality must be 'Tier 1', 'Tier 2', or 'Tier 3'. Got: '${tier}'`);
    }
    
    // Check RTO alignment with tier
    if (tier && rto) {
      const rtoHours = parseInt(rto);
      if (tier === 'Tier 1' && rtoHours > 4) {
        warnings.push(`${appName}: Tier 1 applications should have RTO ≤ 4 hours. Current RTO: ${rto}`);
      } else if (tier === 'Tier 2' && rtoHours > 24) {
        warnings.push(`${appName}: Tier 2 applications should have RTO ≤ 24 hours. Current RTO: ${rto}`);
      }
    }
    
    // Check statutory requirements format
    if (mandates !== undefined && !Array.isArray(mandates)) {
      errors.push(`${appName}: Statutory Requirements must be an array. Got: ${typeof mandates}`);
    }
  }
  
  // Validate Resource Metrics if present
  if (hasResourceMetrics) {
    const metrics = app['Resource Metrics'];
    const hostingCost = parseFloat(metrics['Annual Hosting Cost']) || 0;
    const fte = parseFloat(metrics['FTE Dedicated']) || 0;
    const incidents = parseInt(metrics['Incident Count Annual']) || 0;
    const techAge = parseInt(metrics['Tech Stack Age Years']) || 0;
    
    // Sanity checks
    if (hostingCost < 0) {
      errors.push(`${appName}: Annual Hosting Cost cannot be negative. Got: ${hostingCost}`);
    }
    if (fte < 0) {
      errors.push(`${appName}: FTE Dedicated cannot be negative. Got: ${fte}`);
    }
    if (incidents < 0) {
      errors.push(`${appName}: Incident Count cannot be negative. Got: ${incidents}`);
    }
    if (techAge < 0) {
      errors.push(`${appName}: Tech Stack Age cannot be negative. Got: ${techAge}`);
    }
    
    // Reasonable ranges
    if (hostingCost > 500000) {
      warnings.push(`${appName}: Annual Hosting Cost seems very high: $${hostingCost.toLocaleString()}. Please verify.`);
    }
    if (fte > 10) {
      warnings.push(`${appName}: FTE Dedicated seems very high: ${fte}. Please verify this is O&M, not project work.`);
    }
    if (incidents > 100) {
      warnings.push(`${appName}: Incident Count seems very high: ${incidents}/year. Consider if these are all true incidents.`);
    }
    if (techAge > 20) {
      warnings.push(`${appName}: Tech Stack Age is very old: ${techAge} years. This may need modernization.`);
    }
    
    // Zero FTE with high cost is suspicious
    if (fte === 0 && hostingCost > 10000) {
      warnings.push(`${appName}: High hosting cost ($${hostingCost.toLocaleString()}) but 0 FTE. Consider if staff time should be included.`);
    }
  }
  
  // Email validation
  const contact = app['Product Contact'];
  if (contact && !contact.includes('@')) {
    warnings.push(`${appName}: Product Contact doesn't appear to be a valid email: ${contact}`);
  }
  
  return {
    application: appName,
    isValid: errors.length === 0,
    hasQuantitativeData: hasUserMetrics || hasMissionMetrics || hasResourceMetrics,
    dataQualityScore: calculateDataQualityScore(app),
    errors,
    warnings,
    suggestions
  };
}

/**
 * Calculate data quality score (0-100%)
 */
function calculateDataQualityScore(app) {
  let score = 0;
  let maxScore = 0;
  
  // Required fields (40 points)
  const requiredFields = [
    'Application', 'Program Name', 'Prod URL', 'Public Access?',
    'Technology Stack', 'Product Owner', 'Product Contact',
    'Development Org', 'Hosting Org', 'Number of Users', 'Purpose'
  ];
  
  maxScore += 40;
  let requiredPresent = 0;
  requiredFields.forEach(field => {
    if (app[field] && app[field].toString().trim() !== '') {
      requiredPresent++;
    }
  });
  score += (requiredPresent / requiredFields.length) * 40;
  
  // Purpose quality (10 points)
  maxScore += 10;
  const purpose = app['Purpose'] || '';
  if (purpose.length >= 100) score += 10;
  else if (purpose.length >= 50) score += 5;
  
  // Quantitative metrics (50 points total)
  maxScore += 50;
  
  // User Metrics (15 points)
  const userMetrics = app['User Metrics'];
  if (userMetrics) {
    if (userMetrics['External Users'] !== undefined) score += 5;
    if (userMetrics['Internal Users'] !== undefined) score += 5;
    if (userMetrics['Geographic Scope']) score += 5;
  }
  
  // Mission Metrics (20 points)
  const missionMetrics = app['Mission Metrics'];
  if (missionMetrics) {
    if (missionMetrics['Business Criticality']) score += 10;
    if (missionMetrics['Statutory Requirements']) score += 5;
    if (missionMetrics['RTO (Recovery Time Objective)']) score += 5;
  }
  
  // Resource Metrics (15 points)
  const resourceMetrics = app['Resource Metrics'];
  if (resourceMetrics) {
    if (resourceMetrics['Annual Hosting Cost'] !== undefined) score += 5;
    if (resourceMetrics['FTE Dedicated'] !== undefined) score += 5;
    if (resourceMetrics['Incident Count Annual'] !== undefined) score += 5;
  }
  
  return Math.round((score / maxScore) * 100);
}

/**
 * Validate entire portfolio
 */
export function validatePortfolio(portfolio) {
  const results = portfolio.map(app => validateApplication(app));
  
  const summary = {
    totalApplications: portfolio.length,
    validApplications: results.filter(r => r.isValid).length,
    applicationsWithQuantitativeData: results.filter(r => r.hasQuantitativeData).length,
    totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
    totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
    totalSuggestions: results.reduce((sum, r) => sum + r.suggestions.length, 0),
    averageDataQuality: Math.round(
      results.reduce((sum, r) => sum + r.dataQualityScore, 0) / results.length
    )
  };
  
  return {
    summary,
    results,
    hasErrors: summary.totalErrors > 0,
    hasWarnings: summary.totalWarnings > 0
  };
}

/**
 * Generate validation report
 */
export function generateValidationReport(validation) {
  let report = '\n';
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '   DATA VALIDATION REPORT\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  
  const summary = validation.summary;
  
  report += `Total Applications: ${summary.totalApplications}\n`;
  report += `Valid Applications: ${summary.validApplications} (${Math.round(summary.validApplications / summary.totalApplications * 100)}%)\n`;
  report += `With Quantitative Data: ${summary.applicationsWithQuantitativeData} (${Math.round(summary.applicationsWithQuantitativeData / summary.totalApplications * 100)}%)\n`;
  report += `Average Data Quality: ${summary.averageDataQuality}%\n\n`;
  
  if (summary.totalErrors > 0) {
    report += `❌ Errors: ${summary.totalErrors}\n`;
  } else {
    report += `✅ Errors: 0\n`;
  }
  
  if (summary.totalWarnings > 0) {
    report += `⚠️  Warnings: ${summary.totalWarnings}\n`;
  } else {
    report += `✅ Warnings: 0\n`;
  }
  
  report += `💡 Suggestions: ${summary.totalSuggestions}\n\n`;
  
  // Show errors
  if (summary.totalErrors > 0) {
    report += '───────────────────────────────────────────────────────────────\n';
    report += '❌ ERRORS (Must Fix):\n';
    report += '───────────────────────────────────────────────────────────────\n';
    validation.results.forEach(result => {
      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          report += `\n  • ${error}\n`;
        });
      }
    });
    report += '\n';
  }
  
  // Show warnings
  if (summary.totalWarnings > 0) {
    report += '───────────────────────────────────────────────────────────────\n';
    report += '⚠️  WARNINGS (Should Review):\n';
    report += '───────────────────────────────────────────────────────────────\n';
    validation.results.forEach(result => {
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          report += `\n  • ${warning}\n`;
        });
      }
    });
    report += '\n';
  }
  
  // Show suggestions
  if (summary.totalSuggestions > 0) {
    report += '───────────────────────────────────────────────────────────────\n';
    report += '💡 SUGGESTIONS (Improve Accuracy):\n';
    report += '───────────────────────────────────────────────────────────────\n';
    
    // Group by application
    const appSuggestions = {};
    validation.results.forEach(result => {
      if (result.suggestions.length > 0) {
        const appName = result.application;
        if (!appSuggestions[appName]) {
          appSuggestions[appName] = [];
        }
        appSuggestions[appName].push(...result.suggestions);
      }
    });
    
    Object.keys(appSuggestions).forEach(appName => {
      report += `\n${appName}:\n`;
      appSuggestions[appName].forEach(suggestion => {
        const cleanSuggestion = suggestion.replace(`${appName}: `, '');
        report += `  • ${cleanSuggestion}\n`;
      });
    });
    report += '\n';
  }
  
  // Data quality breakdown
  report += '───────────────────────────────────────────────────────────────\n';
  report += 'DATA QUALITY BY APPLICATION:\n';
  report += '───────────────────────────────────────────────────────────────\n\n';
  
  // Sort by data quality score
  const sortedResults = [...validation.results].sort((a, b) => b.dataQualityScore - a.dataQualityScore);
  
  sortedResults.forEach(result => {
    const status = result.isValid ? '✅' : '❌';
    const quantTag = result.hasQuantitativeData ? '[QUANT]' : '[QUAL]';
    report += `${status} ${result.application.padEnd(50)} ${quantTag} ${result.dataQualityScore}%\n`;
  });
  
  report += '\n═══════════════════════════════════════════════════════════════\n';
  
  return report;
}
