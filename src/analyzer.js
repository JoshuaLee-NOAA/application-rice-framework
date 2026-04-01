/**
 * RICE Framework Analyzer
 * Analyzes application portfolio data and assigns RICE scores based on NOAA Fisheries criteria
 * Supports both QUANTITATIVE (preferred) and QUALITATIVE (fallback) scoring methods
 */

/**
 * Calculate Reach score (1-5)
 * QUANTITATIVE: Based on external users, internal users, geographic scope, regions served
 * QUALITATIVE FALLBACK: Based on text analysis of purpose, program name, user count
 */
function calculateReach(app) {
  // Try quantitative method first
  const metrics = app['User Metrics'];
  
  if (metrics && metrics['External Users'] !== undefined) {
    return calculateReachQuantitative(app, metrics);
  }
  
  // Fallback to qualitative method
  return calculateReachQualitative(app);
}

function calculateReachQuantitative(app, metrics) {
  const externalUsers = parseInt(metrics['External Users']) || 0;
  const internalUsers = parseInt(metrics['Internal Users']) || 0;
  const totalUsers = externalUsers + internalUsers;
  const regionsServed = parseInt(metrics['Number of Regions Served']) || 1;
  const scope = metrics['Geographic Scope'] || 'Local';
  
  let score = 0;
  
  // User count component (0-2 points)
  if (totalUsers >= 10000) score += 2;
  else if (totalUsers >= 5000) score += 1.75;
  else if (totalUsers >= 1000) score += 1.5;
  else if (totalUsers >= 100) score += 1;
  else score += 0.5;
  
  // External user weight (0-2 points) - prioritize external stakeholders
  const externalRatio = totalUsers > 0 ? externalUsers / totalUsers : 0;
  score += externalRatio * 2;
  
  // Geographic scope (0-1 point)
  if (scope === 'National') score += 1;
  else if (scope === 'Regional') score += 0.5;
  else score += 0.25;
  
  // Round to integer 1-5
  const finalScore = Math.max(1, Math.min(5, Math.round(score)));
  
  const explanation = `[QUANTITATIVE] Reach Score ${finalScore}: ${totalUsers.toLocaleString()} total users (${externalUsers.toLocaleString()} external, ${internalUsers.toLocaleString()} internal), ${scope} scope serving ${regionsServed} region(s)`;
  
  return { score: finalScore, explanation, method: 'quantitative' };
}

function calculateReachQualitative(app) {
  const numUsers = parseInt(app['Number of Users']) || 0;
  const publicAccess = app['Public Access?']?.toLowerCase() || 'no';
  const programName = app['Program Name']?.toLowerCase() || '';
  const purpose = app['Purpose']?.toLowerCase() || '';
  
  let score = 1;
  let explanation = '';
  
  const isNational = programName.includes('office of') || 
                     programName.includes('sustainable fisheries') ||
                     programName.includes('protected resources') ||
                     programName.includes('science and technology') ||
                     purpose.includes('national') ||
                     purpose.includes('all regions');
  
  const isRegional = programName.includes('region') || 
                     programName.includes('alaska') ||
                     programName.includes('northeast') ||
                     programName.includes('southeast') ||
                     programName.includes('west coast');
  
  if (isNational && publicAccess === 'yes' && numUsers >= 10000) {
    score = 5;
    explanation = `[QUALITATIVE] Very High Reach: National-scale application with public access and ${numUsers.toLocaleString()} users across all stakeholder groups`;
  } else if (isNational && (publicAccess === 'yes' || numUsers >= 5000)) {
    score = 4;
    explanation = `[QUALITATIVE] High Reach: National-scale application with ${publicAccess === 'yes' ? 'public access' : numUsers.toLocaleString() + ' users'} serving multiple regions`;
  } else if ((isRegional && numUsers >= 1000) || (publicAccess === 'yes' && numUsers >= 2000)) {
    score = 3;
    explanation = `[QUALITATIVE] Medium Reach: ${isRegional ? 'Regional' : 'Multi-program'} application with ${numUsers.toLocaleString()} users`;
  } else if (numUsers >= 100 || (isRegional && numUsers >= 50)) {
    score = 2;
    explanation = `[QUALITATIVE] Low Reach: Program-specific application with ${numUsers} users, limited organizational scope`;
  } else {
    score = 1;
    explanation = `[QUALITATIVE] Minimal Reach: Niche application with only ${numUsers} users in a specific group`;
  }
  
  return { score, explanation, method: 'qualitative' };
}

/**
 * Calculate Impact score (1-5)
 * QUANTITATIVE: Based on business tier, statutory requirements, downtime cost, RTO
 * QUALITATIVE FALLBACK: Based on keyword analysis of purpose and notes
 */
function calculateImpact(app) {
  // Try quantitative method first
  const metrics = app['Mission Metrics'];
  
  if (metrics && metrics['Business Criticality']) {
    return calculateImpactQuantitative(app, metrics);
  }
  
  // Fallback to qualitative method
  return calculateImpactQualitative(app);
}

function calculateImpactQuantitative(app, metrics) {
  const tier = metrics['Business Criticality'] || 'Tier 3';
  const mandates = metrics['Statutory Requirements'] || [];
  const downtimeCost = parseFloat(metrics['Downtime Cost Per Hour']) || 0;
  const rtoString = metrics['RTO (Recovery Time Objective)'] || '72 hours';
  const rtoHours = parseInt(rtoString) || 72;
  
  let score = 0;
  
  // Business criticality base (1-3 points)
  if (tier === 'Tier 1') score += 3;
  else if (tier === 'Tier 2') score += 2;
  else score += 1;
  
  // Statutory requirements (0-1.5 points)
  const criticalLaws = ['MSA', 'ESA', 'MMPA', 'Treaty', 'NEPA'];
  const criticalCount = Array.isArray(mandates) ? mandates.filter(m => criticalLaws.includes(m)).length : 0;
  score += Math.min(1.5, criticalCount * 0.5);
  
  // Financial impact (0-0.5 points)
  if (downtimeCost >= 10000) score += 0.5;
  else if (downtimeCost >= 1000) score += 0.25;
  
  // RTO requirement indicates criticality (0-1 point)
  if (rtoHours <= 4) score += 1;
  else if (rtoHours <= 24) score += 0.5;
  else if (rtoHours <= 48) score += 0.25;
  
  const finalScore = Math.max(1, Math.min(5, Math.round(score)));
  
  const mandateList = Array.isArray(mandates) ? mandates.join(', ') : 'None';
  const explanation = `[QUANTITATIVE] Impact Score ${finalScore}: ${tier} criticality, ${mandates.length || 0} statutory requirements (${mandateList}), $${downtimeCost.toLocaleString()}/hr downtime cost, ${rtoHours}hr RTO`;
  
  return { score: finalScore, explanation, method: 'quantitative' };
}

function calculateImpactQualitative(app) {
  const purpose = app['Purpose']?.toLowerCase() || '';
  const notes = app['Notes']?.toLowerCase() || '';
  const combined = `${purpose} ${notes}`;
  
  let score = 1;
  let explanation = '';
  
  const criticalKeywords = ['critical', 'compliance', 'mandatory', 'required', 'treaty', 'esa', 'regulatory'];
  const highImpactKeywords = ['supports core', 'enforcement', 'quota', 'stock assessment', 'legal', 'law enforcement'];
  const mediumImpactKeywords = ['supports', 'tracking', 'monitoring', 'recovery', 'planning'];
  const lowImpactKeywords = ['incremental', 'engagement', 'explorer', 'tool'];
  
  const hasCritical = criticalKeywords.some(kw => combined.includes(kw));
  const hasHighImpact = highImpactKeywords.some(kw => combined.includes(kw));
  const hasMediumImpact = mediumImpactKeywords.some(kw => combined.includes(kw));
  const hasLowImpact = lowImpactKeywords.some(kw => combined.includes(kw));
  
  if (hasCritical && (combined.includes('mission-critical') || combined.includes('24/7'))) {
    score = 5;
    explanation = `[QUALITATIVE] Very High Impact: Mission-critical application. Failure would result in immediate cessation of regulatory functions or legal non-compliance`;
  } else if (hasCritical || hasHighImpact) {
    score = 4;
    explanation = `[QUALITATIVE] High Impact: Supports core regulatory or scientific workflows. Essential for meeting statutory mandates (${hasCritical ? 'compliance/regulatory' : 'enforcement/scientific'} functions)`;
  } else if (hasMediumImpact || combined.includes('scientific') || combined.includes('database')) {
    score = 3;
    explanation = `[QUALITATIVE] Medium Impact: Supports important scientific or management functions, but not immediately mission-critical`;
  } else if (hasLowImpact || combined.includes('public engagement')) {
    score = 2;
    explanation = `[QUALITATIVE] Low Impact: Provides incremental improvements to workflows or public engagement, but not essential for core mission`;
  } else {
    score = 1;
    explanation = `[QUALITATIVE] Minimal Impact: Peripheral application with limited direct correlation to primary NMFS mission goals`;
  }
  
  return { score, explanation, method: 'qualitative' };
}

/**
 * Calculate Confidence score (1-5)
 * Based on: Data completeness, clarity of purpose, ownership information
 * Now enhanced with data quality scoring for quantitative fields
 */
function calculateConfidence(app) {
  let score = 5;
  let explanation = '';
  
  // Check for quantitative data completeness
  const hasUserMetrics = app['User Metrics'] !== undefined;
  const hasMissionMetrics = app['Mission Metrics'] !== undefined;
  const hasResourceMetrics = app['Resource Metrics'] !== undefined;
  const quantitativeDataCount = (hasUserMetrics ? 1 : 0) + (hasMissionMetrics ? 1 : 0) + (hasResourceMetrics ? 1 : 0);
  
  // Check traditional data completeness
  const requiredFields = [
    'Prod URL', 'Public Access?', 'Technology Stack', 'Product Owner',
    'Product Contact', 'Development Org', 'Hosting Org', 'Number of Users', 'Purpose'
  ];
  
  const optionalFields = ['Dev URL', 'Test URL', 'Project Manager', 'Hosting Cost'];
  
  let missingRequired = 0;
  let missingOptional = 0;
  
  requiredFields.forEach(field => {
    const value = app[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingRequired++;
    }
  });
  
  optionalFields.forEach(field => {
    const value = app[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingOptional++;
    }
  });
  
  const purposeLength = (app['Purpose'] || '').length;
  const purposeDetail = purposeLength > 100 ? 'detailed' : purposeLength > 50 ? 'moderate' : 'limited';
  
  // Enhanced scoring with quantitative data bonus
  if (quantitativeDataCount === 3 && missingRequired === 0 && purposeLength > 100) {
    score = 5;
    explanation = `Very High Confidence: Complete quantitative data (all 3 metric sets) with ${purposeDetail} purpose description. Comprehensive understanding of application`;
  } else if (quantitativeDataCount >= 2 && missingRequired === 0 && purposeLength > 50) {
    score = 5;
    explanation = `Very High Confidence: Strong quantitative data (${quantitativeDataCount}/3 metric sets) with ${purposeDetail} purpose. Clear ownership and reliable metrics`;
  } else if (missingRequired === 0 && purposeLength > 100 && missingOptional <= 1) {
    score = 4;
    explanation = `High Confidence: Complete qualitative data with ${purposeDetail} purpose. Good understanding but would benefit from quantitative metrics`;
  } else if (missingRequired === 0 && purposeLength > 50) {
    score = 4;
    explanation = `High Confidence: Strong data quality with ${purposeDetail} purpose description. Consider adding quantitative metrics`;
  } else if (missingRequired <= 1 && purposeLength > 30) {
    score = 3;
    explanation = `Medium Confidence: Moderate data completeness (${missingRequired} required field${missingRequired !== 1 ? 's' : ''} missing). Some assumptions about usage or mission necessity`;
  } else if (missingRequired <= 2) {
    score = 2;
    explanation = `Low Confidence: Limited data (${missingRequired} required fields missing). Uncertainty about actual user engagement or mission impact`;
  } else {
    score = 1;
    explanation = `Minimal Confidence: Significant data gaps (${missingRequired} required fields missing). Application role and user base poorly defined`;
  }
  
  return { score, explanation, quantitativeDataScore: (quantitativeDataCount / 3 * 100).toFixed(0) + '%' };
}

/**
 * Calculate Effort score (1-5)
 * QUANTITATIVE: Based on hosting cost, FTE, incidents, tech debt, tech age, support tickets
 * QUALITATIVE FALLBACK: Based on technology stack and hosting cost analysis
 * Note: Higher effort = greater resource drain = lower priority
 */
function calculateEffort(app) {
  // Try quantitative method first
  const metrics = app['Resource Metrics'];
  
  if (metrics && (metrics['FTE Dedicated'] !== undefined || metrics['Incident Count Annual'] !== undefined)) {
    return calculateEffortQuantitative(app, metrics);
  }
  
  // Fallback to qualitative method
  return calculateEffortQualitative(app);
}

function calculateEffortQuantitative(app, metrics) {
  const hostingCost = parseFloat(metrics['Annual Hosting Cost']) || 0;
  const fte = parseFloat(metrics['FTE Dedicated']) || 0;
  const incidents = parseInt(metrics['Incident Count Annual']) || 0;
  const techDebtHours = parseInt(metrics['Technical Debt Hours']) || 0;
  const techAge = parseInt(metrics['Tech Stack Age Years']) || 0;
  const tickets = parseInt(metrics['Support Tickets Annual']) || 0;
  
  let score = 0;
  
  // Hosting cost (0-1.5 points)
  if (hostingCost >= 60000) score += 1.5;
  else if (hostingCost >= 30000) score += 1;
  else if (hostingCost >= 10000) score += 0.5;
  else score += 0.25;
  
  // FTE burden (0-1.5 points)
  if (fte >= 3) score += 1.5;
  else if (fte >= 1.5) score += 1;
  else if (fte >= 0.5) score += 0.5;
  else score += 0.25;
  
  // Technical debt (0-1 point)
  if (techDebtHours >= 500) score += 1;
  else if (techDebtHours >= 200) score += 0.5;
  else if (techDebtHours >= 50) score += 0.25;
  
  // Stability issues (0-1 point)
  if (incidents >= 20 || tickets >= 500) score += 1;
  else if (incidents >= 10 || tickets >= 200) score += 0.5;
  else if (incidents >= 5 || tickets >= 100) score += 0.25;
  
  // Technology age (0-0.5 points)
  if (techAge >= 7) score += 0.5;
  else if (techAge >= 5) score += 0.25;
  
  const finalScore = Math.max(1, Math.min(5, Math.round(score)));
  
  const explanation = `[QUANTITATIVE] Effort Score ${finalScore}: $${hostingCost.toLocaleString()}/yr hosting, ${fte} FTE, ${incidents} incidents/yr, ${tickets} tickets/yr, ${techDebtHours}hrs tech debt, ${techAge}yr old stack`;
  
  return { score: finalScore, explanation, method: 'quantitative' };
}

function calculateEffortQualitative(app) {
  const techStack = app['Technology Stack']?.toLowerCase() || '';
  const hostingCost = app['Hosting Cost'] || '';
  const notes = app['Notes']?.toLowerCase() || '';
  const hosting = app['Hosting Org']?.toLowerCase() || '';
  
  let score = 3;
  let explanation = '';
  
  const costMatch = hostingCost.match(/\$?([\d,]+)/);
  const annualCost = costMatch ? parseInt(costMatch[1].replace(/,/g, '')) : 0;
  
  const legacyIndicators = ['oracle forms', 'vba', 'access', 'legacy', 'solaris', 'oracle 11g', 'asp.net'];
  const modernTech = ['react', 'node.js', 'python', 'docker', 'aws', 'azure', 'postgresql'];
  
  const hasLegacy = legacyIndicators.some(tech => techStack.includes(tech));
  const hasModern = modernTech.some(tech => techStack.includes(tech));
  const hasDebt = notes.includes('technical debt') || notes.includes('modernization planned');
  
  if (hasLegacy && (annualCost > 60000 || hasDebt)) {
    score = 5;
    explanation = `[QUALITATIVE] Very High Effort: Legacy technology stack (${techStack.split(',')[0]}) with ${hasDebt ? 'documented technical debt' : 'high cost ($' + annualCost.toLocaleString() + '/year)'}. Requires constant maintenance`;
  } else if (annualCost > 50000 || (hasLegacy && annualCost > 20000)) {
    score = 4;
    explanation = `[QUALITATIVE] High Effort: ${hasLegacy ? 'Legacy systems' : 'High-cost hosting'} requiring significant resources ($${annualCost.toLocaleString()}/year). Frequent manual intervention needed`;
  } else if (annualCost >= 15000 && annualCost <= 50000) {
    score = 3;
    explanation = `[QUALITATIVE] Medium Effort: Moderate maintenance burden with $${annualCost.toLocaleString()}/year hosting cost. Consistent support required`;
  } else if (annualCost >= 5000 && annualCost < 15000) {
    score = 2;
    explanation = `[QUALITATIVE] Low Effort: Low-cost operation ($${annualCost.toLocaleString()}/year) with ${hasModern ? 'modern' : 'stable'} technology. Routine maintenance`;
  } else {
    score = 1;
    explanation = `[QUALITATIVE] Minimal Effort: Very low resource requirements ($${annualCost.toLocaleString()}/year). ${hosting.includes('desktop') ? 'Desktop application' : 'Highly stable system'} with negligible maintenance`;
  }
  
  return { score, explanation, method: 'qualitative' };
}

/**
 * Analyze a single application and return RICE scores
 */
export function analyzeApplication(app) {
  const reach = calculateReach(app);
  const impact = calculateImpact(app);
  const confidence = calculateConfidence(app);
  const effort = calculateEffort(app);
  
  // Prevent division by zero - ensure effort is at least 1
  const effortScore = effort.score === 0 ? 1 : effort.score;
  
  // Calculate RICE score: (Reach × Impact × Confidence) / Effort
  const riceScore = (reach.score * impact.score * confidence.score) / effortScore;
  
  // Determine if using quantitative or qualitative method
  const scoringMethod = {
    reach: reach.method || 'qualitative',
    impact: impact.method || 'qualitative',
    effort: effort.method || 'qualitative'
  };
  
  const isFullyQuantitative = scoringMethod.reach === 'quantitative' && 
                              scoringMethod.impact === 'quantitative' && 
                              scoringMethod.effort === 'quantitative';
  
  return {
    application: app['Application'],
    program: app['Program Name'],
    reach: reach.score,
    impact: impact.score,
    confidence: confidence.score,
    effort: effort.score,
    riceScore: riceScore,
    reachExplanation: reach.explanation,
    impactExplanation: impact.explanation,
    confidenceExplanation: confidence.explanation,
    effortExplanation: effort.explanation,
    scoringMethod: scoringMethod,
    isFullyQuantitative: isFullyQuantitative,
    dataQualityScore: confidence.quantitativeDataScore
  };
}

/**
 * Analyze entire portfolio and return sorted results
 */
export function analyzePortfolio(portfolio) {
  const results = portfolio.map(app => analyzeApplication(app));
  
  // Sort by RICE score (highest first)
  results.sort((a, b) => b.riceScore - a.riceScore);
  
  // Add priority ranking
  results.forEach((result, index) => {
    result.priorityRank = index + 1;
  });
  
  return results;
}

/**
 * Generate summary statistics
 */
export function generateSummary(results) {
  const totalApps = results.length;
  const avgRiceScore = results.reduce((sum, r) => sum + r.riceScore, 0) / totalApps;
  
  const highPriority = results.filter(r => r.riceScore >= 20).length;
  const mediumPriority = results.filter(r => r.riceScore >= 10 && r.riceScore < 20).length;
  const lowPriority = results.filter(r => r.riceScore < 10).length;
  
  const highEffort = results.filter(r => r.effort >= 4);
  const lowImpact = results.filter(r => r.impact <= 2);
  const rationalizationCandidates = results.filter(r => r.effort >= 4 && r.impact <= 2);
  
  // Count quantitative vs qualitative scoring
  const fullyQuantitative = results.filter(r => r.isFullyQuantitative).length;
  const partialQuantitative = results.filter(r => !r.isFullyQuantitative && 
    (r.scoringMethod.reach === 'quantitative' || r.scoringMethod.impact === 'quantitative' || r.scoringMethod.effort === 'quantitative')).length;
  const fullyQualitative = results.filter(r => !r.isFullyQuantitative && 
    r.scoringMethod.reach === 'qualitative' && r.scoringMethod.impact === 'qualitative' && r.scoringMethod.effort === 'qualitative').length;
  
  return {
    totalApps,
    avgRiceScore: avgRiceScore.toFixed(2),
    highPriority,
    mediumPriority,
    lowPriority,
    highEffortApps: highEffort.length,
    lowImpactApps: lowImpact.length,
    rationalizationCandidates: rationalizationCandidates.length,
    topPriority: results.slice(0, 5),
    attentionNeeded: rationalizationCandidates,
    dataQuality: {
      fullyQuantitative,
      partialQuantitative,
      fullyQualitative,
      quantitativePercentage: ((fullyQuantitative / totalApps) * 100).toFixed(1) + '%'
    }
  };
}
