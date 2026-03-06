/**
 * RICE Framework Analysis Tool - Main Entry Point
 * NOAA Fisheries Application Portfolio Management
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { analyzePortfolio, generateSummary } from './analyzer.js';
import { exportToCSV, exportSummaryText, exportToJSON } from './exporters.js';
import { validatePortfolio, generateValidationReport } from './validator.js';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const DATA_PATH = join(__dirname, '../data/portfolio.json');
const OUTPUT_DIR = join(__dirname, '../output');
const CSV_OUTPUT = join(OUTPUT_DIR, 'rice-analysis.csv');
const JSON_OUTPUT = join(OUTPUT_DIR, 'rice-analysis.json');

/**
 * Main analysis function
 */
function main() {
  try {
    console.log('\n🔍 RICE Framework Analysis Tool - Starting...\n');
    
    // Read portfolio data
    console.log('📁 Loading portfolio data...');
    const portfolioData = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
    console.log(`   ✓ Loaded ${portfolioData.length} applications\n`);
    
    // Validate data quality
    console.log('✓  Validating data quality...');
    const validation = validatePortfolio(portfolioData);
    console.log(`   ✓ Validation complete\n`);
    
    // Show validation report
    const validationReport = generateValidationReport(validation);
    console.log(validationReport);
    
    // Stop if there are critical errors
    if (validation.hasErrors) {
      console.error('❌ Cannot proceed with analysis due to validation errors.');
      console.error('Please fix the errors above and try again.\n');
      process.exit(1);
    }
    
    // Analyze portfolio
    console.log('⚙️  Analyzing applications with RICE framework...');
    const results = analyzePortfolio(portfolioData);
    console.log('   ✓ Analysis complete\n');
    
    // Generate summary
    console.log('📊 Generating summary statistics...');
    const summary = generateSummary(results);
    console.log('   ✓ Summary generated\n');
    
    // Create output directory
    try {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    } catch (err) {
      // Directory already exists, ignore
    }
    
    // Export to CSV
    console.log('💾 Exporting results...');
    const csvContent = exportToCSV(results);
    writeFileSync(CSV_OUTPUT, csvContent, 'utf8');
    console.log(`   ✓ CSV exported to: output/rice-analysis.csv`);
    
    // Export to JSON
    const jsonContent = exportToJSON(results, summary);
    writeFileSync(JSON_OUTPUT, jsonContent, 'utf8');
    console.log(`   ✓ JSON exported to: output/rice-analysis.json`);
    
    // Display summary
    const summaryText = exportSummaryText(summary);
    console.log(summaryText);
    
    console.log('\n✅ Analysis complete! Results saved to output directory.\n');
    
  } catch (error) {
    console.error('\n❌ Error during analysis:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the analysis
main();
