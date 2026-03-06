# RICE Framework Analysis Tool

A strategic prioritization framework for NOAA Fisheries Application Portfolio Management. This tool evaluates applications based on **Reach**, **Impact**, **Confidence**, and **Effort** (RICE) metrics to provide data-driven prioritization recommendations.

## Overview

The RICE analysis serves as an objective method to categorize and prioritize applications within the NOAA Fisheries OCIO portfolio. The framework calculates priority scores using the formula:

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

Higher scores indicate higher priority for resource allocation and focus.

## Metric Definitions

### Reach (1-5)
Measures the breadth of the application's influence based on:
- User base type (external vs. internal)
- Total number of users
- Organizational scope (National vs. Regional)

### Impact (1-5)
Measures contribution to NMFS mission:
- Mission-critical functions
- Regulatory compliance requirements
- Scientific workflow support

### Confidence (1-5)
Qualitative measure of assessment reliability:
- Data completeness
- Clarity of purpose
- Certainty in application value

### Effort (1-5)
Cost of ownership in terms of IT resources:
- Technology stack (legacy vs. modern)
- Hosting costs
- Maintenance burden

*Note: Higher Effort reduces priority score*

## Installation

### Prerequisites
- Node.js (v14 or higher)

### Setup
```bash
# Clone or navigate to the repository
cd application-rice-framework

# No dependencies to install - uses pure Node.js
```

## Usage

### Run Analysis
```bash
npm start
```

Or:
```bash
node src/index.js
```

### Input Data
Place your application portfolio data in `data/portfolio.json`. The tool expects the following fields:

- Program Name
- Application
- Prod URL
- Dev URL
- Test URL
- Any Additional url
- Public Access?
- Requires Login?
- Type of Login
- Akamai?
- Technology Stack
- Product Owner
- Product Contact
- Project Manager
- Development Team
- Development Org
- Hosting Org
- Hosting Cost
- Number of Users
- Purpose
- Funding Notes
- Notes

### Output

The tool generates three outputs in the `output/` directory:

#### 1. CSV File (`rice-analysis.csv`)
Detailed spreadsheet with:
- Priority rankings
- RICE scores for each application
- Individual metric scores (R, I, C, E)
- Explanations for each score

**Perfect for importing into Excel, Google Sheets, or other analysis tools.**

#### 2. JSON File (`rice-analysis.json`)
Machine-readable format including:
- Analysis metadata
- Summary statistics
- Full results array

**Ready for future dashboard integration and visualization tools.**

#### 3. Console Summary
Real-time summary displaying:
- Portfolio overview
- Priority distribution
- Top 5 priority applications
- Rationalization candidates (high effort + low impact)

## Scoring Logic

### Automated Scoring Rules

The tool automatically assigns scores based on:

**Reach:**
- Analyzes public access, user count, and program scope
- National + External + 10K+ users = Very High (5)
- Niche tools with <50 users = Minimal (1)

**Impact:**
- Scans purpose and notes for mission-critical keywords
- Regulatory/compliance/mandatory = Very High (5)
- Public engagement tools = Low (2)

**Confidence:**
- Evaluates data completeness and purpose clarity
- Complete data + detailed purpose = Very High (5)
- Missing data + vague purpose = Low (1-2)

**Effort:**
- Assesses technology stack and hosting costs
- Legacy tech + high cost + technical debt = Very High (5)
- Modern tech + low cost = Minimal (1)

### Human Review

The tool provides explanations for each score to support human validation and adjustment. Teams should:
1. Review automated scores
2. Validate assumptions with subject matter experts
3. Adjust input data or scoring logic as needed
4. Re-run analysis to generate updated results

## Example Output

```
═══════════════════════════════════════════════════════════════
   RICE FRAMEWORK ANALYSIS SUMMARY
   NOAA Fisheries Application Portfolio Management
═══════════════════════════════════════════════════════════════

Total Applications Analyzed: 12
Average RICE Score: 15.83

PRIORITY DISTRIBUTION:
  • High Priority (Score ≥ 20):    5 applications
  • Medium Priority (Score 10-20): 4 applications
  • Low Priority (Score < 10):     3 applications

───────────────────────────────────────────────────────────────
TOP 5 PRIORITY APPLICATIONS:
───────────────────────────────────────────────────────────────

1. Electronic Fisheries Permit System (eFPS)
   Program: Sustainable Fisheries
   RICE Score: 33.33 (R:5 × I:5 × C:4 / E:3)

...
```

## Future Enhancements

This tool is designed for easy extension:

- **Web Dashboard**: JSON output ready for Google Charts or D3.js visualization
- **Custom Scoring**: Modify `src/analyzer.js` to adjust scoring algorithms
- **Additional Metrics**: Add new dimensions beyond RICE
- **Interactive UI**: Web forms for data entry and real-time analysis

## Project Structure

```
application-rice-framework/
├── data/
│   └── portfolio.json          # Input: Application portfolio data
├── src/
│   ├── analyzer.js             # Core RICE scoring algorithms
│   ├── exporters.js            # CSV/JSON export functionality
│   └── index.js                # Main entry point
├── output/
│   ├── rice-analysis.csv       # Output: Detailed analysis
│   └── rice-analysis.json      # Output: Structured data
├── package.json
└── README.md
```

## Contributing

To customize scoring logic:

1. Edit `src/analyzer.js` - Modify `calculateReach()`, `calculateImpact()`, `calculateConfidence()`, or `calculateEffort()` functions
2. Adjust thresholds and keywords to match your organization's priorities
3. Test with your portfolio data
4. Document changes in scoring explanations

## License

MIT License - NOAA Fisheries OCIO

## Support

For questions or issues, contact the Application Delivery Branch or submit an issue in the repository.

---

**Built for NOAA Fisheries by the Office of the CIO**
