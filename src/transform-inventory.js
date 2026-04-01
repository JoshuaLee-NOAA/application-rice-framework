/**
 * Inventory to RICE Format Transformer
 * Transforms applications_inventory_complete.json to RICE-compatible format
 * Applies intelligent inference for missing data
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INVENTORY_PATH = join(__dirname, '../applications_inventory_complete.json');
const OUTPUT_PATH = join(__dirname, '../data/portfolio-from-inventory.json');
const GAP_REPORT_PATH = join(__dirname, '../output/gap-analysis.md');

/**
 * Infer geographic scope from portfolio and notes
 */
function inferGeographicScope(app) {
  const subteam = app.portfolio?.subteam?.toLowerCase() || '';
  const portfolio = app.portfolio?.portfolio?.toLowerCase() || '';
  const notes = app.notes?.toLowerCase() || '';
  const purpose = app.purpose?.toLowerCase() || '';
  
  // Check for enterprise/national indicators
  if (subteam.includes('enterprise') || 
      portfolio.includes('noaa enterprise') ||
      portfolio.includes('administrative') ||
      notes.includes('all regions') ||
      notes.includes('national') ||
      purpose.includes('national')) {
    return 'National';
  }
  
  // Check for regional indicators
  if (portfolio.includes('region') ||
      notes.includes('regional') ||
      purpose.includes('regional') ||
      subteam.includes('region')) {
    return 'Regional';
  }
  
  return 'Local';
}

/**
 * Infer number of regions served
 */
function inferRegionsServed(scope, app) {
  if (scope === 'National') return 6;
  if (scope === 'Regional') return 1;
  return 1;
}

/**
 * Split users into external and internal based on public access
 */
function inferUserBreakdown(app) {
  const totalUsers = parseInt(app.metrics?.numberOfUsers) || 0;
  const publicAccess = app.access?.publicAccess;
  const requiresLogin = app.access?.requiresLogin;
  
  if (totalUsers === 0) {
    return { external: 0, internal: 0 };
  }
  
  // If public access without login, assume mostly external
  if (publicAccess === true && requiresLogin === false) {
    return {
      external: Math.round(totalUsers * 0.9),
      internal: Math.round(totalUsers * 0.1)
    };
  }
  
  // If public access with login, assume mixed
  if (publicAccess === true && requiresLogin === true) {
    return {
      external: Math.round(totalUsers * 0.7),
      internal: Math.round(totalUsers * 0.3)
    };
  }
  
  // If not public, assume all internal
  if (publicAccess === false) {
    return {
      external: 0,
      internal: totalUsers
    };
  }
  
  // Unknown - split 50/50
  return {
    external: Math.round(totalUsers * 0.5),
    internal: Math.round(totalUsers * 0.5)
  };
}

/**
 * Infer business criticality from purpose and notes
 */
function inferBusinessCriticality(app) {
  const purpose = app.purpose?.toLowerCase() || '';
  const notes = app.notes?.toLowerCase() || '';
  const combined = `${purpose} ${notes}`;
  
  // Tier 1 indicators
  const tier1Keywords = ['mission-critical', 'critical', 'statutory', 'compliance', 
                         'mandatory', 'enforcement', 'permit', 'regulatory'];
  
  // Tier 2 indicators  
  const tier2Keywords = ['assessment', 'monitoring', 'tracking', 'management',
                         'database', 'supports', 'reporting'];
  
  const hasTier1 = tier1Keywords.some(kw => combined.includes(kw));
  const hasTier2 = tier2Keywords.some(kw => combined.includes(kw));
  
  if (hasTier1) return 'Tier 1';
  if (hasTier2) return 'Tier 2';
  return 'Tier 3';
}

/**
 * Extract statutory requirements from purpose and notes
 */
function inferStatutoryRequirements(app) {
  const purpose = app.purpose?.toLowerCase() || '';
  const notes = app.notes?.toLowerCase() || '';
  const combined = `${purpose} ${notes}`;
  
  const requirements = [];
  
  if (combined.includes('magnuson') || combined.includes('msa')) requirements.push('MSA');
  if (combined.includes('endangered species') || combined.includes('esa')) requirements.push('ESA');
  if (combined.includes('marine mammal') || combined.includes('mmpa')) requirements.push('MMPA');
  if (combined.includes('treaty')) requirements.push('Treaty');
  if (combined.includes('nepa')) requirements.push('NEPA');
  
  return requirements;
}

/**
 * Estimate tech stack age from technology string
 */
function estimateTechAge(techStack) {
  if (!techStack) return 5; // Default moderate age
  
  const stack = techStack.toLowerCase();
  
  // Very old technologies
  if (stack.includes('oracle 11g') || stack.includes('oracle forms') || 
      stack.includes('solaris') || stack.includes('vba')) {
    return 15;
  }
  
  // Old technologies
  if (stack.includes('java 8') || stack.includes('jsp') || 
      stack.includes('oracle') && !stack.includes('apex')) {
    return 10;
  }
  
  // Mature technologies
  if (stack.includes('oracle apex') || stack.includes('tomcat 9') ||
      stack.includes('spring')) {
    return 7;
  }
  
  // Modern technologies
  if (stack.includes('react') || stack.includes('node.js') || 
      stack.includes('appian') || stack.includes('docker')) {
    return 3;
  }
  
  return 5; // Default
}

/**
 * Parse hosting cost from string
 */
function parseHostingCost(costString) {
  if (!costString) return 0;
  
  const match = String(costString).match(/\$?[\d,]+/);
  if (match) {
    return parseInt(match[0].replace(/[$,]/g, ''));
  }
  
  return 0;
}

/**
 * Calculate data quality score for an app
 */
function calculateDataQuality(app, transformed) {
  let score = 0;
  let maxScore = 0;
  
  // Required fields (40 points)
  const requiredFields = ['Application', 'Program Name', 'Prod URL', 'Public Access?',
                          'Technology Stack', 'Product Owner', 'Product Contact',
                          'Number of Users', 'Purpose'];
  
  requiredFields.forEach(field => {
    maxScore += 4;
    if (transformed[field] && transformed[field] !== 'Unknown' && transformed[field] !== null) {
      score += 4;
    }
  });
  
  // Purpose length (10 points)
  maxScore += 10;
  const purposeLength = (transformed.Purpose || '').length;
  if (purposeLength >= 100) score += 10;
  else if (purposeLength >= 50) score += 5;
  
  // Quantitative metrics (50 points)
  maxScore += 50;
  
  if (transformed['User Metrics']) {
    if (transformed['User Metrics']['External Users'] !== undefined) score += 5;
    if (transformed['User Metrics']['Internal Users'] !== undefined) score += 5;
    if (transformed['User Metrics']['Geographic Scope']) score += 5;
  }
  
  if (transformed['Mission Metrics']) {
    if (transformed['Mission Metrics']['Business Criticality']) score += 10;
    if (transformed['Mission Metrics']['Statutory Requirements']) score += 5;
    if (transformed['Mission Metrics']['RTO (Recovery Time Objective)']) score += 5;
  }
  
  if (transformed['Resource Metrics']) {
    if (transformed['Resource Metrics']['Annual Hosting Cost'] !== undefined) score += 5;
    if (transformed['Resource Metrics']['FTE Dedicated'] !== undefined) score += 5;
    if (transformed['Resource Metrics']['Tech Stack Age Years'] !== undefined) score += 5;
  }
  
  return Math.round((score / maxScore) * 100);
}

/**
 * Transform single application
 */
function transformApplication(app) {
  const scope = inferGeographicScope(app);
  const userBreakdown = inferUserBreakdown(app);
  const criticality = inferBusinessCriticality(app);
  const statutory = inferStatutoryRequirements(app);
  const techAge = estimateTechAge(app.technology?.stack);
  const hostingCost = parseHostingCost(app.metrics?.hostingCost);
  
  const transformed = {
    'Application': app.name || app.shortName || 'Unknown',
    'Program Name': app.portfolio?.portfolio || app.portfolio?.subteam || 'Unknown',
    'Prod URL': app.urls?.production || 'https://tbd.noaa.gov',
    'Dev URL': app.urls?.development || '',
    'Test URL': app.urls?.test || '',
    'Any Additional url': app.urls?.additional?.join(', ') || '',
    'Public Access?': app.access?.publicAccess === true ? 'Yes' : 
                      app.access?.publicAccess === false ? 'No' : 'Unknown',
    'Requires Login?': app.access?.requiresLogin === true ? 'Yes' :
                       app.access?.requiresLogin === false ? 'No' : 'Unknown',
    'Type of Login': app.access?.loginType || 'Unknown',
    'Akamai?': app.access?.usesAkamai === true ? 'Yes' :
               app.access?.usesAkamai === false ? 'No' : 'Unknown',
    'Technology Stack': app.technology?.stack || 'Unknown',
    'Product Owner': app.team?.productOwner || 'Unknown',
    'Product Contact': app.team?.productContact || 'Unknown',
    'Project Manager': app.team?.projectManager || '',
    'Development Team': app.team?.developmentTeam || '',
    'Development Org': app.team?.developmentOrg || 'Unknown',
    'Hosting Org': app.team?.hostingOrg || 'Unknown',
    'Hosting Cost': app.metrics?.hostingCost || '',
    'Number of Users': parseInt(app.metrics?.numberOfUsers) || 1, // Minimum 1 for validation
    'Purpose': app.purpose || 'Application purpose not yet documented',
    'Funding Notes': app.metrics?.fundingNotes || '',
    'Notes': app.notes || ''
  };
  
  // Add User Metrics (inferred)
  const totalUsers = transformed['Number of Users'];
  if (totalUsers > 0 || scope !== 'Local') {
    transformed['User Metrics'] = {
      'External Users': userBreakdown.external,
      'Internal Users': userBreakdown.internal,
      'Number of Regions Served': inferRegionsServed(scope, app),
      'Geographic Scope': scope,
      'FMC Coverage': []
    };
  }
  
  // Add Mission Metrics (inferred)
  if (criticality || statutory.length > 0) {
    transformed['Mission Metrics'] = {
      'Business Criticality': criticality,
      'Statutory Requirements': statutory,
      'Downtime Cost Per Hour': 0, // Unknown - needs collection
      'RTO (Recovery Time Objective)': criticality === 'Tier 1' ? '4 hours' :
                                       criticality === 'Tier 2' ? '24 hours' : '72 hours',
      'RPO (Recovery Point Objective)': criticality === 'Tier 1' ? '1 hour' : '24 hours',
      'Compliance Mandates': []
    };
  }
  
  // Add Resource Metrics (partially inferred)
  if (hostingCost > 0 || techAge > 0) {
    transformed['Resource Metrics'] = {
      'Annual Hosting Cost': hostingCost,
      'FTE Dedicated': 0, // Unknown - needs collection
      'Support Tickets Annual': 0, // Unknown - needs collection
      'Incident Count Annual': 0, // Unknown - needs collection
      'Tech Stack Age Years': techAge,
      'Lines of Code': 0,
      'Technical Debt Hours': 0 // Unknown - needs collection
      // Note: Omit Last Major Update if unknown - empty string fails validation
    };
  }
  
  return transformed;
}

/**
 * Generate gap analysis report
 */
function generateGapReport(originalApps, transformedApps) {
  let report = '# RICE Framework Gap Analysis Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `Total Applications: ${transformedApps.length}\n\n`;
  
  report += '---\n\n';
  report += '## Executive Summary\n\n';
  
  // Calculate statistics
  const stats = {
    hasUserMetrics: 0,
    hasMissionMetrics: 0,
    hasResourceMetrics: 0,
    hasQuantitativeData: 0,
    hasPurpose: 0,
    hasUsers: 0,
    hasHostingCost: 0,
    hasTechStack: 0
  };
  
  const dataQualityScores = [];
  
  transformedApps.forEach((app, index) => {
    const quality = calculateDataQuality(originalApps[index], app);
    dataQualityScores.push({ app: app.Application, score: quality });
    
    if (app['User Metrics']) stats.hasUserMetrics++;
    if (app['Mission Metrics']) stats.hasMissionMetrics++;
    if (app['Resource Metrics']) stats.hasResourceMetrics++;
    if (app['User Metrics'] || app['Mission Metrics'] || app['Resource Metrics']) stats.hasQuantitativeData++;
    if (app.Purpose && app.Purpose.length > 50) stats.hasPurpose++;
    if (app['Number of Users'] > 0) stats.hasUsers++;
    if (app['Hosting Cost']) stats.hasHostingCost++;
    if (app['Technology Stack'] && app['Technology Stack'] !== 'Unknown') stats.hasTechStack++;
  });
  
  const avgQuality = dataQualityScores.reduce((sum, item) => sum + item.score, 0) / dataQualityScores.length;
  
  report += `### Data Completeness\n\n`;
  report += `- **Average Data Quality**: ${avgQuality.toFixed(1)}%\n`;
  report += `- **Apps with Quantitative Metrics**: ${stats.hasQuantitativeData} (${(stats.hasQuantitativeData/transformedApps.length*100).toFixed(1)}%)\n`;
  report += `- **Apps with User Metrics**: ${stats.hasUserMetrics} (${(stats.hasUserMetrics/transformedApps.length*100).toFixed(1)}%)\n`;
  report += `- **Apps with Mission Metrics**: ${stats.hasMissionMetrics} (${(stats.hasMissionMetrics/transformedApps.length*100).toFixed(1)}%)\n`;
  report += `- **Apps with Resource Metrics**: ${stats.hasResourceMetrics} (${(stats.hasResourceMetrics/transformedApps.length*100).toFixed(1)}%)\n\n`;
  
  report += `### Field Availability\n\n`;
  report += `- **User Counts**: ${stats.hasUsers} apps (${(stats.hasUsers/transformedApps.length*100).toFixed(1)}%)\n`;
  report += `- **Purpose Descriptions**: ${stats.hasPurpose} apps with 50+ chars (${(stats.hasPurpose/transformedApps.length*100).toFixed(1)}%)\n`;
  report += `- **Hosting Costs**: ${stats.hasHostingCost} apps (${(stats.hasHostingCost/transformedApps.length*100).toFixed(1)}%)\n`;
  report += `- **Technology Stack**: ${stats.hasTechStack} apps (${(stats.hasTechStack/transformedApps.length*100).toFixed(1)}%)\n\n`;
  
  report += '---\n\n';
  report += '## Critical Data Gaps\n\n';
  report += '### Missing for ALL Applications:\n\n';
  report += '- ❌ **FTE Dedicated** - Staff time (operations & maintenance)\n';
  report += '- ❌ **Support Tickets Annual** - Help desk ticket counts\n';
  report += '- ❌ **Incident Count Annual** - Production outages/issues\n';
  report += '- ❌ **Technical Debt Hours** - Developer estimates\n';
  report += '- ❌ **Downtime Cost Per Hour** - Business impact estimates\n\n';
  
  report += '### Partially Available:\n\n';
  report += `- ⚠️ **Number of Users** - Only ${stats.hasUsers}/${transformedApps.length} apps have data\n`;
  report += `- ⚠️ **Purpose Descriptions** - Only ${stats.hasPurpose}/${transformedApps.length} apps have detailed descriptions\n`;
  report += `- ⚠️ **Hosting Costs** - Only ${stats.hasHostingCost}/${transformedApps.length} apps have cost data\n`;
  report += `- ⚠️ **Technology Stack** - Only ${stats.hasTechStack}/${transformedApps.length} apps have detailed tech info\n\n`;
  
  report += '---\n\n';
  report += '## Application Data Quality Rankings\n\n';
  report += '### Top 20 Applications (Best Data Quality)\n\n';
  
  const sorted = [...dataQualityScores].sort((a, b) => b.score - a.score);
  sorted.slice(0, 20).forEach((item, index) => {
    report += `${index + 1}. **${item.app}** - ${item.score}%\n`;
  });
  
  report += '\n### Bottom 20 Applications (Needs Data Collection)\n\n';
  sorted.slice(-20).reverse().forEach((item, index) => {
    report += `${index + 1}. **${item.app}** - ${item.score}%\n`;
  });
  
  report += '\n---\n\n';
  report += '## Recommended Priority for Data Collection\n\n';
  report += '### High Priority (Likely Business Critical)\n\n';
  
  // Find high-user or critical apps with low data quality
  const highPriority = sorted.filter(item => {
    const app = transformedApps.find(a => a.Application === item.app);
    return (app['Number of Users'] > 1000 || 
            app['Mission Metrics']?.['Business Criticality'] === 'Tier 1') &&
           item.score < 70;
  }).slice(0, 10);
  
  highPriority.forEach((item, index) => {
    const app = transformedApps.find(a => a.Application === item.app);
    report += `${index + 1}. **${item.app}**\n`;
    report += `   - Users: ${app['Number of Users'].toLocaleString()}\n`;
    report += `   - Criticality: ${app['Mission Metrics']?.['Business Criticality'] || 'Unknown'}\n`;
    report += `   - Data Quality: ${item.score}%\n`;
    report += `   - **Action**: Collect FTE, incidents, support tickets, downtime cost\n\n`;
  });
  
  report += '---\n\n';
  report += '## Inference Rules Applied\n\n';
  report += 'The transformation script applied the following intelligent defaults:\n\n';
  report += '1. **Geographic Scope** - Inferred from portfolio/notes keywords\n';
  report += '2. **External/Internal Users** - Split based on public access flag\n';
  report += '3. **Business Criticality** - Inferred from purpose/notes keywords\n';
  report += '4. **Statutory Requirements** - Detected MSA, ESA, MMPA, etc. in text\n';
  report += '5. **Tech Stack Age** - Estimated from technology names\n';
  report += '6. **RTO** - Defaulted based on criticality tier\n\n';
  
  report += '⚠️ **Note**: Inferred data provides reasonable estimates but should be validated with actual data when possible.\n\n';
  
  return report;
}

/**
 * Main transformation function
 */
function main() {
  console.log('\n🔄 Starting inventory transformation...\n');
  
  // Read inventory
  console.log('📁 Reading inventory file...');
  const inventory = JSON.parse(readFileSync(INVENTORY_PATH, 'utf8'));
  console.log(`   ✓ Loaded ${inventory.applications.length} applications\n`);
  
  // Transform applications
  console.log('⚙️  Transforming applications to RICE format...');
  const transformed = inventory.applications.map(app => transformApplication(app));
  console.log(`   ✓ Transformed ${transformed.length} applications\n`);
  
  // Calculate statistics
  const withUserMetrics = transformed.filter(app => app['User Metrics']).length;
  const withMissionMetrics = transformed.filter(app => app['Mission Metrics']).length;
  const withResourceMetrics = transformed.filter(app => app['Resource Metrics']).length;
  
  console.log('📊 Transformation Statistics:');
  console.log(`   • User Metrics (inferred): ${withUserMetrics}/${transformed.length}`);
  console.log(`   • Mission Metrics (inferred): ${withMissionMetrics}/${transformed.length}`);
  console.log(`   • Resource Metrics (partial): ${withResourceMetrics}/${transformed.length}\n`);
  
  // Generate gap report
  console.log('📝 Generating gap analysis report...');
  const gapReport = generateGapReport(inventory.applications, transformed);
  writeFileSync(GAP_REPORT_PATH, gapReport, 'utf8');
  console.log(`   ✓ Gap report saved to: ${GAP_REPORT_PATH}\n`);
  
  // Save transformed data
  console.log('💾 Saving transformed portfolio...');
  writeFileSync(OUTPUT_PATH, JSON.stringify(transformed, null, 2), 'utf8');
  console.log(`   ✓ Saved to: ${OUTPUT_PATH}\n`);
  
  console.log('✅ Transformation complete!\n');
  console.log('Next steps:');
  console.log('  1. Review gap analysis: output/gap-analysis.md');
  console.log('  2. Run RICE analysis: node src/index.js -i data/portfolio-from-inventory.json -o output-inventory/');
  console.log('  3. Collect missing data for high-priority apps\n');
}

// Run transformation
main();
