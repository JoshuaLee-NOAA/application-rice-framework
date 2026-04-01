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
import { validatePortfolioSchema, generateSchemaValidationReport } from './schema-validator.js';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const DATA_PATH = join(__dirname, '../data/portfolio.json');
const OUTPUT_DIR = join(__dirname, '../output');
const CSV_OUTPUT = join(OUTPUT_DIR, 'rice-analysis.csv');
const JSON_OUTPUT = join(OUTPUT_DIR, 'rice-analysis.json');

// Version (from package.json)
const VERSION = '1.0.0';

/**
 * Display help message
 */
function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  RICE Framework Analysis Tool                                  ║
║  NOAA Fisheries Application Portfolio Management               ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  npm start                    Run analysis with default settings
  node src/index.js            Run analysis directly
  node src/index.js [OPTIONS]  Run with options

OPTIONS:
  -h, --help                   Show this help message
  -v, --version                Show version number
  -i, --input <file>           Input portfolio JSON file
                               (default: data/portfolio.json)
  -o, --output <dir>           Output directory for results
                               (default: output/)

EXAMPLES:
  node src/index.js --help
  node src/index.js --version
  node src/index.js -i data/my-portfolio.json
  node src/index.js -i data/portfolio.json -o results/

OUTPUT FILES:
  • CSV file:  Detailed analysis for spreadsheets
  • JSON file: Structured data for dashboards
  • Console:   Summary statistics and insights

DOCUMENTATION:
  • README.md - Getting started guide
  • docs/data-dictionary.md - Field definitions and scoring logic
  • data/portfolio-template.json - Data structure example

For more information, visit the project repository.
`);
}

/**
 * Display version
 */
function showVersion() {
  console.log(`RICE Framework Analysis Tool v${VERSION}`);
  console.log('NOAA Fisheries OCIO - Application Portfolio Management');
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    version: false,
    inputPath: DATA_PATH,
    outputDir: OUTPUT_DIR
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-v' || arg === '--version') {
      options.version = true;
    } else if (arg === '-i' || arg === '--input') {
      if (i + 1 < args.length) {
        options.inputPath = args[i + 1];
        i++; // Skip next argument
      } else {
        console.error('Error: --input requires a file path');
        process.exit(1);
      }
    } else if (arg === '-o' || arg === '--output') {
      if (i + 1 < args.length) {
        options.outputDir = args[i + 1];
        i++; // Skip next argument
      } else {
        console.error('Error: --output requires a directory path');
        process.exit(1);
      }
    } else {
      console.error(`Error: Unknown option '${arg}'`);
      console.error('Use --help to see available options');
      process.exit(1);
    }
  }
  
  return options;
}

/**
 * Main analysis function
 */
function main() {
  try {
    // Parse command line arguments
    const options = parseArgs();
    
    // Handle --help
    if (options.help) {
      showHelp();
      process.exit(0);
    }
    
    // Handle --version
    if (options.version) {
      showVersion();
      process.exit(0);
    }
    
    // Use parsed options for paths
    const inputPath = options.inputPath;
    const outputDir = options.outputDir;
    const csvOutput = join(outputDir, 'rice-analysis.csv');
    const jsonOutput = join(outputDir, 'rice-analysis.json');
    
    console.log('\n🔍 RICE Framework Analysis Tool - Starting...\n');
    
    // Read portfolio data
    console.log('📁 Loading portfolio data...');
    let portfolioData;
    try {
      portfolioData = JSON.parse(readFileSync(inputPath, 'utf8'));
    } catch (error) {
      console.error(`❌ Error reading input file: ${inputPath}`);
      console.error(`   ${error.message}\n`);
      process.exit(1);
    }
    console.log(`   ✓ Loaded ${portfolioData.length} applications\n`);
    
    // Validate JSON schema
    console.log('🔍 Validating JSON schema...');
    const schemaValidation = validatePortfolioSchema(portfolioData);
    const schemaReport = generateSchemaValidationReport(schemaValidation);
    console.log(schemaReport);
    
    // Stop if there are schema errors
    if (!schemaValidation.valid) {
      console.error('❌ Cannot proceed with analysis due to schema validation errors.');
      console.error('Please fix the structural errors above and try again.\n');
      process.exit(1);
    }
    
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
      mkdirSync(outputDir, { recursive: true });
    } catch (err) {
      // Directory already exists, ignore
    }
    
    // Export to CSV
    console.log('💾 Exporting results...');
    const csvContent = exportToCSV(results);
    writeFileSync(csvOutput, csvContent, 'utf8');
    console.log(`   ✓ CSV exported to: ${csvOutput}`);
    
    // Export to JSON
    const jsonContent = exportToJSON(results, summary);
    writeFileSync(jsonOutput, jsonContent, 'utf8');
    console.log(`   ✓ JSON exported to: ${jsonOutput}`);
    
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
