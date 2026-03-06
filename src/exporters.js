/**
 * Export functionality for RICE Framework analysis results
 */

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCSVField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

/**
 * Convert analysis results to CSV format
 */
export function exportToCSV(results) {
  const headers = [
    'Priority Rank',
    'Application',
    'Program',
    'RICE Score',
    'Reach',
    'Impact',
    'Confidence',
    'Effort',
    'Scoring Method',
    'Data Quality',
    'Reach Explanation',
    'Impact Explanation',
    'Confidence Explanation',
    'Effort Explanation'
  ];
  
  // Create header row
  const csvRows = [headers.join(',')];
  
  // Add data rows
  results.forEach(result => {
    const scoringMethod = result.isFullyQuantitative ? 'Quantitative' : 
                         (result.scoringMethod.reach === 'quantitative' || 
                          result.scoringMethod.impact === 'quantitative' || 
                          result.scoringMethod.effort === 'quantitative') ? 'Mixed' : 'Qualitative';
    
    const row = [
      result.priorityRank,
      escapeCSVField(result.application),
      escapeCSVField(result.program),
      result.riceScore.toFixed(2),
      result.reach,
      result.impact,
      result.confidence,
      result.effort,
      scoringMethod,
      result.dataQualityScore || 'N/A',
      escapeCSVField(result.reachExplanation),
      escapeCSVField(result.impactExplanation),
      escapeCSVField(result.confidenceExplanation),
      escapeCSVField(result.effortExplanation)
    ];
    
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}

/**
 * Export summary to formatted text
 */
export function exportSummaryText(summary) {
  let text = '\n';
  text += '═══════════════════════════════════════════════════════════════\n';
  text += '   RICE FRAMEWORK ANALYSIS SUMMARY\n';
  text += '   NOAA Fisheries Application Portfolio Management\n';
  text += '═══════════════════════════════════════════════════════════════\n\n';
  
  text += `Total Applications Analyzed: ${summary.totalApps}\n`;
  text += `Average RICE Score: ${summary.avgRiceScore}\n\n`;
  
  // Add data quality information if available
  if (summary.dataQuality) {
    text += 'DATA QUALITY:\n';
    text += `  • Fully Quantitative Scoring: ${summary.dataQuality.fullyQuantitative} (${summary.dataQuality.quantitativePercentage})\n`;
    text += `  • Mixed Quantitative/Qualitative: ${summary.dataQuality.partialQuantitative}\n`;
    text += `  • Fully Qualitative Scoring: ${summary.dataQuality.fullyQualitative}\n\n`;
  }
  
  text += 'PRIORITY DISTRIBUTION:\n';
  text += `  • High Priority (Score ≥ 20):    ${summary.highPriority} applications\n`;
  text += `  • Medium Priority (Score 10-20): ${summary.mediumPriority} applications\n`;
  text += `  • Low Priority (Score < 10):     ${summary.lowPriority} applications\n\n`;
  
  text += 'KEY INSIGHTS:\n';
  text += `  • High Effort Applications: ${summary.highEffortApps}\n`;
  text += `  • Low Impact Applications: ${summary.lowImpactApps}\n`;
  text += `  • Rationalization Candidates (High Effort + Low Impact): ${summary.rationalizationCandidates}\n\n`;
  
  text += '───────────────────────────────────────────────────────────────\n';
  text += 'TOP 5 PRIORITY APPLICATIONS:\n';
  text += '───────────────────────────────────────────────────────────────\n';
  
  summary.topPriority.forEach((app, index) => {
    text += `\n${index + 1}. ${app.application}\n`;
    text += `   Program: ${app.program}\n`;
    text += `   RICE Score: ${app.riceScore.toFixed(2)} (R:${app.reach} × I:${app.impact} × C:${app.confidence} / E:${app.effort})\n`;
  });
  
  if (summary.attentionNeeded.length > 0) {
    text += '\n\n───────────────────────────────────────────────────────────────\n';
    text += 'APPLICATIONS REQUIRING ATTENTION:\n';
    text += '(High Effort + Low Impact - Potential Rationalization Candidates)\n';
    text += '───────────────────────────────────────────────────────────────\n';
    
    summary.attentionNeeded.forEach((app, index) => {
      text += `\n${index + 1}. ${app.application}\n`;
      text += `   Program: ${app.program}\n`;
      text += `   RICE Score: ${app.riceScore.toFixed(2)} (R:${app.reach} × I:${app.impact} × C:${app.confidence} / E:${app.effort})\n`;
      text += `   → ${app.effortExplanation}\n`;
      text += `   → ${app.impactExplanation}\n`;
    });
  }
  
  text += '\n\n═══════════════════════════════════════════════════════════════\n';
  text += 'For detailed analysis, see: output/rice-analysis.csv\n';
  text += '═══════════════════════════════════════════════════════════════\n';
  
  return text;
}

/**
 * Export results to JSON format (for future dashboard use)
 */
export function exportToJSON(results, summary) {
  return JSON.stringify({
    metadata: {
      generatedAt: new Date().toISOString(),
      totalApplications: summary.totalApps,
      framework: 'RICE (Reach × Impact × Confidence / Effort)'
    },
    summary: summary,
    results: results
  }, null, 2);
}
