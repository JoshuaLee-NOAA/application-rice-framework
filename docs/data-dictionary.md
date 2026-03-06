# RICE Framework Data Dictionary

Complete field definitions and guidance for collecting application portfolio data.

## 📋 Table of Contents
- [Basic Information](#basic-information)
- [User Metrics (Quantitative - REACH)](#user-metrics-quantitative---reach)
- [Mission Metrics (Quantitative - IMPACT)](#mission-metrics-quantitative---impact)
- [Resource Metrics (Quantitative - EFFORT)](#resource-metrics-quantitative---effort)
- [Data Collection Best Practices](#data-collection-best-practices)

---

## Basic Information

### Required Fields

| Field | Type | Valid Values | Description |
|-------|------|--------------|-------------|
| **Application** | Text | Any | Official application name |
| **Program Name** | Text | Any | Program, division, or organizational unit |
| **Prod URL** | URL | Valid URL | Production environment URL |
| **Public Access?** | Enum | Yes / No / Partial | Is app accessible to external users? |
| **Requires Login?** | Enum | Yes / No | Does app require authentication? |
| **Type of Login** | Text | Login.gov / NOAA SSO / Custom Auth / N/A | Authentication method |
| **Technology Stack** | Text | Any | Primary technologies (e.g., "React, Node.js, PostgreSQL") |
| **Product Owner** | Text | Full Name | Person accountable for the application |
| **Product Contact** | Email | valid@noaa.gov | Primary contact email |
| **Development Org** | Text | Internal OCIO / External Contractor / Regional / Science Center | Who develops/maintains |
| **Hosting Org** | Text | AWS / Azure / On-premise / Regional / Desktop | Where app is hosted |
| **Hosting Cost** | Text | $XX,XXX/year | Annual hosting costs |
| **Number of Users** | Integer | Numeric | Total user count (used if quantitative data unavailable) |
| **Purpose** | Text | 100+ chars recommended | Detailed application description |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| **Dev URL** | URL | Development environment URL |
| **Test URL** | URL | Test/staging environment URL |
| **Any Additional url** | URL | API endpoints or other URLs |
| **Akamai?** | Enum (Yes/No) | Uses Akamai CDN/security? |
| **Project Manager** | Text | Project manager name |
| **Funding Notes** | Text | Funding source information |
| **Notes** | Text | Additional context or notes |

---

## User Metrics (Quantitative - REACH)

**Purpose:** Provides objective data for calculating Reach scores based on actual user counts and scope.

### Fields

| Field | Type | Valid Values | How to Collect | Impact on REACH Score |
|-------|------|--------------|----------------|----------------------|
| **External Users** | Integer | 0+ | Count of users outside NOAA (industry, public, state/tribal partners) | ⬆️ High weight: External users increase score significantly |
| **Internal Users** | Integer | 0+ | Count of NOAA staff users | ⬆️ Medium weight: Contributes to total user base |
| **Number of Regions Served** | Integer | 1-6+ | How many NOAA Fisheries regions use this app? | ⬆️ Shows geographic breadth |
| **Geographic Scope** | Enum | National / Regional / Local | Scale of deployment | ⬆️ National > Regional > Local |
| **FMC Coverage** | Array | [NPFMC, PFMC, ...] | Optional: Which Fishery Management Councils are served? | ℹ️ Informational only |

### Scoring Formula

```
Reach Score = f(User Count, External Ratio, Geographic Scope, Regions)

Components:
- User Count (0-2 pts):    10K+ users = 2.0, 5K+ = 1.75, 1K+ = 1.5, 100+ = 1.0, <100 = 0.5
- External Ratio (0-2 pts): (External / Total) × 2 = prioritizes external stakeholders
- Geographic Scope (0-1 pt): National = 1.0, Regional = 0.5, Local = 0.25

Final Score: 1-5 (rounded)
```

### Data Collection Tips

**External Users:**
- Check Google Analytics for public-facing sites
- Review registration/account databases
- Ask industry liaisons for industry user estimates
- Include: commercial fishermen, recreational anglers, consultants, researchers, state partners

**Internal Users:**
- Query authentication logs (last 90 days active users)
- Check Active Directory groups
- Survey regional coordinators
- Include: NOAA staff, contractors with NOAA accounts

**Geographic Scope:**
- National: Serves all 6 NOAA Fisheries regions OR Office/HQ level
- Regional: Serves 1-2 specific regions
- Local: Single science center, regional office, or program

---

## Mission Metrics (Quantitative - IMPACT)

**Purpose:** Provides objective data for calculating Impact scores based on business criticality and regulatory requirements.

### Fields

| Field | Type | Valid Values | How to Collect | Impact on IMPACT Score |
|-------|------|--------------|----------------|------------------------|
| **Business Criticality** | Enum | Tier 1 / Tier 2 / Tier 3 | COOP/BCP classification or Product Owner assessment | ⬆️⬆️⬆️ Highest weight (1-3 pts) |
| **Statutory Requirements** | Array | [MSA, ESA, MMPA, Treaty, NEPA] | Legal/policy review | ⬆️⬆️ Each law adds 0.5 pts |
| **Downtime Cost Per Hour** | Float | Dollar amount | Financial impact estimate | ⬆️ $10K+/hr = 0.5 pts |
| **RTO (Recovery Time Objective)** | Text | "4 hours", "24 hours", "72 hours" | From BCP or IT Disaster Recovery plan | ⬆️ Lower RTO = higher score |
| **RPO (Recovery Point Objective)** | Text | "1 hour", "24 hours", "1 week" | From BCP or backup strategy | ℹ️ Informational |
| **Compliance Mandates** | Array | Specific requirements | From regulatory team | ℹ️ Informational |

### Business Criticality Tier Definitions

| Tier | Definition | Examples | RTO Target |
|------|------------|----------|------------|
| **Tier 1** | Mission Critical - 24/7 availability required. Immediate impact to mission if down. | Permit systems during season, VMS monitoring, quota tracking | ≤ 4 hours |
| **Tier 2** | High Impact - Core workflows depend on it. Significant delays if unavailable. | Stock assessment databases, observer data systems, regulatory databases | ≤ 24 hours |
| **Tier 3** | Supporting - Supports operations but workarounds exist. Manageable delays acceptable. | Reference tools, public engagement sites, reporting systems | ≤ 72 hours |

### Statutory Requirements Reference

| Acronym | Full Name | Scope |
|---------|-----------|-------|
| **MSA** | Magnuson-Stevens Fishery Conservation and Management Act | Primary fisheries management law |
| **ESA** | Endangered Species Act | Protected species recovery and consultation |
| **MMPA** | Marine Mammal Protection Act | Marine mammal management |
| **Treaty** | International treaties | ICCAT, WCPFC, etc. |
| **NEPA** | National Environmental Policy Act | Environmental review requirements |

### Scoring Formula

```
Impact Score = f(Business Tier, Statutory Reqs, Downtime Cost, RTO)

Components:
- Business Tier (1-3 pts):     Tier 1 = 3, Tier 2 = 2, Tier 3 = 1
- Statutory Reqs (0-1.5 pts):  0.5 pt per critical law (MSA, ESA, MMPA, Treaty, NEPA)
- Downtime Cost (0-0.5 pts):   $10K+/hr = 0.5, $1K+/hr = 0.25
- RTO (0-1 pt):                ≤4hrs = 1.0, ≤24hrs = 0.5, ≤48hrs = 0.25

Final Score: 1-5 (rounded)
```

### Data Collection Tips

**Business Criticality:**
- Review Continuity of Operations Plan (COOP)
- Check Business Continuity Plan (BCP)
- Consult with ISSO or IT Security team
- Ask: "What happens if this is down for 4 hours? 24 hours? A week?"

**Downtime Cost:**
- Consider: Lost revenue (permits, fees), staff productivity loss, regulatory penalties, reputational damage
- Conservative estimate okay - use ranges ($1K, $10K, $50K, etc.)

**RTO:**
- Check existing disaster recovery documentation
- If unknown, use tier guidelines (Tier 1 = 4hrs, Tier 2 = 24hrs, Tier 3 = 72hrs)

---

## Resource Metrics (Quantitative - EFFORT)

**Purpose:** Provides objective data for calculating Effort scores based on actual resource consumption.

### Fields

| Field | Type | Valid Values | How to Collect | Impact on EFFORT Score |
|-------|------|--------------|----------------|------------------------|
| **Annual Hosting Cost** | Float | Dollar amount | From cloud bills or budget | ⬆️ Higher cost = more effort |
| **FTE Dedicated** | Float | 0.0 - 10.0+ | Time tracking or estimates | ⬆️⬆️ Primary driver (0.5 FTE increments) |
| **Support Tickets Annual** | Integer | 0+ | From help desk system | ⬆️ 500+ tickets = high maintenance |
| **Incident Count Annual** | Integer | 0+ | From incident management system | ⬆️ 20+ incidents = unstable |
| **Tech Stack Age Years** | Integer | 0+ | Calculate from release date | ⬆️ 7+ years = legacy |
| **Technical Debt Hours** | Integer | 0+ | Developer estimate | ⬆️ 500+ hrs = significant debt |
| **Lines of Code** | Integer | 0+ | From code analysis tools | ℹ️ Informational |
| **Security Vulnerabilities** | Integer | 0+ | From security scans | ℹ️ Informational |
| **Last Major Update** | Date | YYYY-MM-DD | From release notes | ℹ️ Indicates maintenance activity |

### Scoring Formula

```
Effort Score = f(Hosting Cost, FTE, Tech Debt, Incidents, Tickets, Tech Age)

Components:
- Hosting Cost (0-1.5 pts):    $60K+ = 1.5, $30K+ = 1.0, $10K+ = 0.5
- FTE (0-1.5 pts):             3+ = 1.5, 1.5+ = 1.0, 0.5+ = 0.5
- Tech Debt (0-1 pt):          500+ hrs = 1.0, 200+ = 0.5, 50+ = 0.25
- Incidents/Tickets (0-1 pt):  20 incidents OR 500 tickets = 1.0
- Tech Age (0-0.5 pts):        7+ years = 0.5, 5+ = 0.25

Final Score: 1-5 (rounded)
NOTE: Higher effort score = LOWER priority in RICE formula
```

### Data Collection Tips

**Annual Hosting Cost:**
- Sum all cloud costs: compute, storage, bandwidth, databases, licenses
- For on-premise: estimated hardware, power, cooling, space allocation
- Don't include personnel costs (captured in FTE)

**FTE Dedicated:**
- Include developers, DevOps, support staff
- Use decimals: 0.25 = quarter-time, 0.5 = half-time, 1.0 = full-time
- Count: routine maintenance, enhancements, support, firefighting
- Exclude: new feature development projects (that's investment, not O&M)

**Tech Stack Age:**
- Use the oldest major component that can't easily be upgraded
- Examples:
  - Rails 3 (released 2011) = 15 years in 2026
  - React 18 (released 2022) = 4 years in 2026
  - Oracle 11g (released 2007) = 19 years in 2026

**Technical Debt:**
- Ask developers: "If we had 2 sprint's worth of time, what would we refactor?"
- Include: deprecated dependencies, security vulnerabilities, known bugs, code smells
- Rough estimates okay: Small = 50hrs, Medium = 200hrs, Large = 500hrs, XL = 1000hrs

**Incidents:**
- Production outages, data corruption, security breaches, performance degradations
- Don't count: planned maintenance, user errors, environment-specific issues
- Check: PagerDuty, ServiceNow, Jira incident tickets

**Support Tickets:**
- User-reported issues: bugs, questions, access problems, feature requests
- Check: ServiceNow, Jira Service Desk, email inbox
- Annual count from last full year

---

## Data Collection Best Practices

### Phased Approach

**Phase 1: Start with Basics**
- Collect all Basic Information fields (existing qualitative approach)
- Run initial analysis to establish baseline

**Phase 2: Add Easy Quantitative Data**
- External Users, Internal Users, Geographic Scope
- Business Criticality tier
- Annual Hosting Cost
- FTE Dedicated

**Phase 3: Add Detailed Metrics**
- Statutory Requirements
- Downtime Cost, RTO
- Support Tickets, Incidents
- Tech Stack Age, Technical Debt

**Phase 4: Automate**
- Pull user counts from authentication logs
- Pull costs from cloud billing APIs
- Pull tickets/incidents from ServiceNow/Jira
- Pull tech stack from dependency scanners

### Data Sources

| Metric | Potential Data Source | Access |
|--------|----------------------|--------|
| User Counts | Google Analytics, Auth logs, AD groups | Analytics team, IT |
| Business Tier | COOP/BCP documentation | CIO office, ISSO |
| Statutory Requirements | Program offices, policy team | Program managers |
| Hosting Costs | Cloud billing dashboards, finance | FinOps, budget office |
| FTE | Time tracking, project plans | Team leads, PMO |
| Incidents | ServiceNow, PagerDuty | IT operations |
| Support Tickets | ServiceNow, Jira Service Desk | Help desk |
| Tech Stack Age | package.json, requirements.txt, pom.xml | Development team |
| Technical Debt | SonarQube, developer estimates | Development team |

### Data Quality Guidelines

✅ **DO:**
- Use actual data wherever possible
- Document your assumptions
- Update annually or when significant changes occur
- Be consistent across applications
- Use conservative estimates when uncertain

❌ **DON'T:**
- Inflate numbers to game the system
- Mix time periods (e.g., monthly vs annual)
- Include one-time costs in annual costs
- Count the same users twice
- Guess wildly - use qualitative fallback instead

### Validation Checklist

Before finalizing your data:
- [ ] User counts add up (External + Internal = Total)
- [ ] Business Tier aligns with RTO (Tier 1 should have short RTO)
- [ ] Hosting Cost seems reasonable for technology stack
- [ ] FTE estimate validated by team lead
- [ ] Incident count matches team's perception of stability
- [ ] Tech Stack Age calculated from actual release date
- [ ] Purpose field is detailed (100+ characters)
- [ ] Product Owner and Contact are correct

---

## Frequently Asked Questions

**Q: What if I don't have quantitative data for some metrics?**
A: That's okay! The analyzer uses qualitative fallback methods. Start with what you have and add quantitative data over time.

**Q: Should I count contractors as Internal Users?**
A: Yes, if they have NOAA accounts. Count anyone who authenticates as "internal."

**Q: How do I determine Business Criticality if there's no COOP/BCP?**
A: Ask: "If this were down for a week, would it stop us from meeting a statutory deadline or cause significant mission impact?" Yes = Tier 1 or 2. No = Tier 3.

**Q: What's the difference between Incident and Support Ticket?**
A: Incident = service disruption (app down, data loss). Support Ticket = user request (how do I..., I found a bug).

**Q: Can Technical Debt be negative?**
A: No, use 0. Even well-maintained apps have some refactoring opportunities.

**Q: Should I include costs for dev/test environments?**
A: Yes, include all environment costs in Annual Hosting Cost.

**Q: What if the app has zero External Users but is still important?**
A: That's fine! The Impact score will capture mission importance. Reach score will be lower, which is accurate.

---

## Support

For questions about data collection or definitions, contact:
- Application Delivery Branch
- OCIO Portfolio Management Team
- Submit an issue in the repository
