# RICE Framework - Frontend Implementation Plan

**Project:** Application RICE Framework Web UI  
**Framework:** Next.js 14 + Tailwind CSS + shadcn/ui  
**Branding:** NOAA Official Colors  
**Date:** April 2026  
**Version:** 1.0

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [NOAA Design System](#noaa-design-system)
4. [Git Workflow](#git-workflow)
5. [Phase 1: Foundation](#phase-1-foundation)
6. [Phase 2: Data Layer](#phase-2-data-layer)
7. [Phase 3: Core UI](#phase-3-core-ui)
8. [Phase 4: Analysis & Visualizations](#phase-4-analysis--visualizations)
9. [Phase 5: Polish & Deploy](#phase-5-polish--deploy)
10. [API Specifications](#api-specifications)
11. [Component Library](#component-library)
12. [Testing Strategy](#testing-strategy)
13. [Deployment Guide](#deployment-guide)

---

## Project Overview

### Goals
Build a modern, web-based UI for the RICE Framework that enables:
- ✅ View applications in sortable, filterable table
- ✅ Perform CRUD operations on application data
- ✅ Re-run RICE analysis after edits
- ✅ View analysis results, summaries, and visualizations
- ✅ Export data and reports
- ✅ Gap analysis and data quality tracking

### Architecture
**Monorepo Structure:**
```
application-rice-framework/
├── frontend/                 # Next.js app (NEW)
│   ├── app/                 # App router
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   └── public/              # Static assets
├── src/                     # Existing Node.js (SHARED)
│   ├── analyzer.js
│   ├── validator.js
│   └── ...
├── data/                    # Data storage
├── docs/                    # Documentation
└── package.json
```

---

## Tech Stack

### Frontend Framework
- **Next.js 14** (App Router)
  - Server-side rendering
  - API routes for backend
  - TypeScript support
  - File-based routing

### Styling & Components
- **Tailwind CSS** - Utility-first CSS with NOAA colors
- **shadcn/ui** - Accessible components built on Radix UI
- **lucide-react** - Icon library

### Data & Forms
- **TanStack Table v8** - Powerful data tables
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualizations

### State Management
- **React Server Components** - Server state
- **React Hooks** - Client state
- **SWR** or **TanStack Query** - Data fetching (optional)

---

## NOAA Design System

### Official Brand Colors

```typescript
// NOAA Color Palette
const noaaColors = {
  // Primary Brand Colors
  darkBlue: {
    pantone: '287 C',
    hex: '#003087',
    rgb: 'rgb(0, 48, 135)',
    cmyk: 'c100 m87 y20 k11'
  },
  lightBlue: {
    pantone: 'Process Blue C',
    hex: '#0085CA',
    rgb: 'rgb(0, 133, 202)',
    cmyk: 'c82 m38 y0 k0'
  }
};
```

### Tailwind Configuration

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // NOAA Brand Colors
        noaa: {
          'dark-blue': '#003087',
          'light-blue': '#0085CA',
        },
        // Extended Navy Scale
        navy: {
          50: '#e6ebf4',
          100: '#b3c3df',
          200: '#809bca',
          300: '#4d73b5',
          400: '#1a4ba0',
          500: '#003087', // NOAA Dark Blue
          600: '#00266c',
          700: '#001d51',
          800: '#001336',
          900: '#000a1b',
        },
        // Extended Ocean Scale
        ocean: {
          50: '#e6f4fb',
          100: '#b3e0f5',
          200: '#80ccef',
          300: '#4db8e9',
          400: '#1aa4e3',
          500: '#0085CA', // NOAA Light Blue
          600: '#006ba2',
          700: '#00517a',
          800: '#003751',
          900: '#001d29',
        },
        // Neutrals (for backgrounds, text)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### Color Usage Guidelines

| Element | Color | Usage |
|---------|-------|-------|
| **Primary Buttons** | Navy 500 | Main actions, CTAs |
| **Secondary Buttons** | Ocean 500 | Secondary actions |
| **Links** | Ocean 600 | All hyperlinks |
| **Link Hover** | Ocean 700 | Hover state |
| **Navigation** | Navy 900 bg | Top nav background |
| **Sidebar** | Slate 50 | Sidebar background |
| **Headers** | Navy 800 | H1, H2 text |
| **Body Text** | Slate 700 | Default text |
| **Borders** | Slate 200 | Dividers, cards |
| **Success** | Green 600 | Positive actions |
| **Warning** | Amber 600 | Alerts |
| **Error** | Red 600 | Errors, delete |
| **Info** | Ocean 500 | Info badges |

### Component Styling Examples

**Primary Button:**
```tsx
<Button className="bg-navy-500 hover:bg-navy-600 text-white">
  Run Analysis
</Button>
```

**Card with NOAA Header:**
```tsx
<Card>
  <CardHeader className="bg-gradient-to-r from-navy-900 to-navy-700 text-white">
    <CardTitle>Applications Portfolio</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Data Visualization Colors:**
```tsx
const chartColors = {
  reach: '#0085CA',      // Ocean 500
  impact: '#003087',     // Navy 500
  confidence: '#006ba2', // Ocean 600
  effort: '#64748b',     // Slate 500
};
```

---

## Git Workflow

### Branch Strategy

```
main (protected branch)
  ├── feature/phase-1-foundation
  │   └── PR #1: Foundation complete
  ├── feature/phase-2-data
  │   └── PR #2: Data layer complete
  ├── feature/phase-3-ui
  │   └── PR #3: Core UI complete
  ├── feature/phase-4-analysis
  │   └── PR #4: Analysis & viz complete
  └── feature/phase-5-deploy
      └── PR #5: Polish & deploy complete
```

### Workflow Per Phase

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/phase-X-name
   ```

2. **Development**
   - Implement phase deliverables
   - Commit frequently with clear messages
   - Test thoroughly

3. **Pre-PR Checklist**
   - [ ] All deliverables complete
   - [ ] Tests passing
   - [ ] No console errors
   - [ ] Code formatted (Prettier)
   - [ ] Documentation updated

4. **Create Pull Request**
   ```bash
   git push origin feature/phase-X-name
   # Create PR on GitHub
   ```

5. **PR Review & Merge**
   - Code review
   - Test in preview environment
   - Merge to main
   - Delete feature branch

6. **Tag Release**
   ```bash
   git tag v0.X.0-phaseX
   git push origin v0.X.0-phaseX
   ```

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(ui): add applications table with sorting
fix(api): handle validation errors correctly
docs(readme): update setup instructions
```

---

## Pull Request Template

```markdown
## Phase X: [Phase Name]

### 📋 Deliverables Checklist

**Phase X Objectives:**
- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

**Testing:**
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing complete

**Code Quality:**
- [ ] TypeScript types defined
- [ ] No linter warnings
- [ ] Code formatted with Prettier
- [ ] Responsive design verified

**Documentation:**
- [ ] README updated
- [ ] API docs updated
- [ ] Comments added for complex logic

### 🧪 How to Test

1. Step 1
2. Step 2
3. Expected result

### 📸 Screenshots

[Add screenshots of new features]

### 🚀 Deployment Notes

[Any special deployment considerations]

### 📝 Additional Notes

[Any other context for reviewers]
```

---

## Phase 1: Foundation

**Branch:** `feature/phase-1-foundation`  
**Timeline:** Week 1 (5 days)  
**Goal:** Set up Next.js project with NOAA branding and basic structure

### Objectives

1. ✅ Initialize Next.js 14 project with TypeScript
2. ✅ Configure Tailwind CSS with NOAA colors
3. ✅ Install and configure shadcn/ui
4. ✅ Create basic layout (navigation, sidebar)
5. ✅ Set up routing structure
6. ✅ Create TypeScript types from JSON schema
7. ✅ Add ESLint and Prettier configuration

### Deliverables

#### 1.1 Project Initialization
```bash
# Create Next.js app
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd frontend

# Install core dependencies
npm install @tanstack/react-table recharts
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install date-fns

# Install shadcn/ui
npx shadcn-ui@latest init

# Install shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tooltip
```

#### 1.2 Tailwind Configuration
Create `tailwind.config.ts` with NOAA colors (see Design System section)

#### 1.3 Directory Structure
```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard home
│   ├── applications/
│   │   ├── page.tsx            # Applications table
│   │   ├── new/page.tsx        # Add application
│   │   └── [id]/
│   │       ├── page.tsx        # View application
│   │       └── edit/page.tsx   # Edit application
│   ├── analysis/
│   │   └── page.tsx            # Analysis results
│   ├── visualizations/
│   │   └── page.tsx            # Charts & graphs
│   ├── data-quality/
│   │   └── page.tsx            # Gap analysis
│   └── api/
│       └── applications/
│           └── route.ts        # CRUD API
├── components/
│   ├── ui/                     # shadcn components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── applications/
│   │   ├── ApplicationTable.tsx
│   │   ├── ApplicationForm.tsx
│   │   └── ApplicationCard.tsx
│   ├── analysis/
│   │   ├── RICEScoreCard.tsx
│   │   ├── PriorityChart.tsx
│   │   └── QuadrantView.tsx
│   └── common/
│       ├── DataQualityBadge.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── schema.ts               # Zod schemas
│   ├── api-client.ts           # API helper functions
│   └── utils.ts                # Utility functions
└── public/
    └── noaa-logo.svg           # NOAA logo
```

#### 1.4 Layout Components

**`app/layout.tsx`** - Root layout with NOAA header
```tsx
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RICE Framework - NOAA Fisheries',
  description: 'Application Portfolio Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
```

**`components/layout/Header.tsx`** - NOAA-branded header
```tsx
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-navy-900 to-navy-700 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-navy-900 font-bold text-sm">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">RICE Framework</h1>
              <p className="text-xs text-ocean-200">
                NOAA Fisheries OCIO
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-ocean-500 text-white border-ocean-600 hover:bg-ocean-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Analysis
          </Button>
        </div>
      </div>
    </header>
  );
}
```

**`components/layout/Sidebar.tsx`** - Navigation sidebar
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  PieChart,
  CheckCircle2,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: Database },
  { name: 'Analysis', href: '/analysis', icon: BarChart3 },
  { name: 'Visualizations', href: '/visualizations', icon: PieChart },
  { name: 'Data Quality', href: '/data-quality', icon: CheckCircle2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-navy-500 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

#### 1.5 TypeScript Types

**`lib/types.ts`** - Core types
```typescript
import { z } from 'zod';

// User Metrics Schema
export const UserMetricsSchema = z.object({
  'External Users': z.number().min(0),
  'Internal Users': z.number().min(0),
  'Number of Regions Served': z.number().min(1).max(6),
  'Geographic Scope': z.enum(['National', 'Regional', 'Local']),
  'FMC Coverage': z.array(z.string()).optional(),
});

// Mission Metrics Schema
export const MissionMetricsSchema = z.object({
  'Business Criticality': z.enum(['Tier 1', 'Tier 2', 'Tier 3']),
  'Statutory Requirements': z.array(z.string()),
  'Downtime Cost Per Hour': z.number().min(0),
  'RTO (Recovery Time Objective)': z.string(),
  'RPO (Recovery Point Objective)': z.string().optional(),
  'Compliance Mandates': z.array(z.string()).optional(),
});

// Resource Metrics Schema
export const ResourceMetricsSchema = z.object({
  'Annual Hosting Cost': z.number().min(0),
  'FTE Dedicated': z.number().min(0),
  'Support Tickets Annual': z.number().min(0),
  'Incident Count Annual': z.number().min(0),
  'Tech Stack Age Years': z.number().min(0),
  'Lines of Code': z.number().min(0).optional(),
  'Technical Debt Hours': z.number().min(0),
  'Security Vulnerabilities': z.number().min(0).optional(),
  'Last Major Update': z.string().optional(),
});

// Application Schema
export const ApplicationSchema = z.object({
  id: z.string().optional(),
  Application: z.string().min(1, 'Application name is required'),
  'Program Name': z.string().min(1, 'Program name is required'),
  'Prod URL': z.string().url().or(z.literal('')),
  'Dev URL': z.string().url().or(z.literal('')).optional(),
  'Test URL': z.string().url().or(z.literal('')).optional(),
  'Any Additional url': z.string().optional(),
  'Public Access?': z.enum(['Yes', 'No', 'Unknown']),
  'Requires Login?': z.enum(['Yes', 'No', 'Unknown']).optional(),
  'Type of Login': z.string().optional(),
  'Akamai?': z.enum(['Yes', 'No', 'Unknown']).optional(),
  'Technology Stack': z.string().min(1, 'Technology stack is required'),
  'Product Owner': z.string().min(1, 'Product owner is required'),
  'Product Contact': z.string(),
  'Project Manager': z.string().optional(),
  'Development Team': z.string().optional(),
  'Development Org': z.string().optional(),
  'Hosting Org': z.string().optional(),
  'Hosting Cost': z.string().optional(),
  'Number of Users': z.number().min(0),
  Purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  'Funding Notes': z.string().optional(),
  Notes: z.string().optional(),
  'User Metrics': UserMetricsSchema.optional(),
  'Mission Metrics': MissionMetricsSchema.optional(),
  'Resource Metrics': ResourceMetricsSchema.optional(),
});

export type Application = z.infer<typeof ApplicationSchema>;
export type UserMetrics = z.infer<typeof UserMetricsSchema>;
export type MissionMetrics = z.infer<typeof MissionMetricsSchema>;
export type ResourceMetrics = z.infer<typeof ResourceMetricsSchema>;

// RICE Analysis Result
export interface RICEResult {
  priorityRank: number;
  application: string;
  program: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  riceScore: number;
  reachExplanation: string;
  impactExplanation: string;
  confidenceExplanation: string;
  effortExplanation: string;
  scoringMethod: {
    reach: 'quantitative' | 'qualitative';
    impact: 'quantitative' | 'qualitative';
    effort: 'quantitative' | 'qualitative';
  };
  isFullyQuantitative: boolean;
  dataQualityScore: string;
}
```

#### 1.6 Basic Dashboard

**`app/page.tsx`** - Dashboard home
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Application Portfolio Management Overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Database className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-700">73</div>
            <p className="text-xs text-slate-600 mt-1">
              In portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average RICE Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-ocean-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ocean-600">17.2</div>
            <p className="text-xs text-slate-600 mt-1">
              Across all apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Priority
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">25</div>
            <p className="text-xs text-slate-600 mt-1">
              Score ≥ 20
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Needs Attention
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">26</div>
            <p className="text-xs text-slate-600 mt-1">
              Score &lt; 10
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Start by viewing your <a href="/applications" className="text-ocean-600 hover:text-ocean-700 underline">applications</a> or 
            running a new <a href="/analysis" className="text-ocean-600 hover:text-ocean-700 underline">RICE analysis</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Testing Checklist

- [ ] Next.js app runs without errors
- [ ] Tailwind styles applied correctly
- [ ] NOAA colors match brand guidelines
- [ ] Navigation works between pages
- [ ] Dashboard displays correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] TypeScript types compile without errors

### Success Criteria

✅ Modern, professional UI with NOAA branding  
✅ Clean project structure  
✅ Type-safe development environment  
✅ All pages accessible via navigation  

---

## Phase 2: Data Layer

**Branch:** `feature/phase-2-data`  
**Timeline:** Week 2 (5 days)  
**Goal:** Build API routes and data management

### Objectives

1. ✅ Create CRUD API endpoints
2. ✅ Implement file system data storage
3. ✅ Add validation middleware
4. ✅ Error handling and logging
5. ✅ API tests

### Deliverables

#### 2.1 Data Storage Utilities

**`lib/db.ts`** - File system database
```typescript
import fs from 'fs/promises';
import path from 'path';
import { Application } from './types';

const DATA_DIR = path.join(process.cwd(), '../data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');

export class Database {
  private static async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  static async getAllApplications(): Promise<Application[]> {
    try {
      const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async getApplication(id: string): Promise<Application | null> {
    const apps = await this.getAllApplications();
    return apps.find(app => app.id === id) || null;
  }

  static async createApplication(app: Application): Promise<Application> {
    await this.ensureDataDir();
    const apps = await this.getAllApplications();
    
    const newApp = {
      ...app,
      id: crypto.randomUUID(),
    };
    
    apps.push(newApp);
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(apps, null, 2));
    
    return newApp;
  }

  static async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    const apps = await this.getAllApplications();
    const index = apps.findIndex(app => app.id === id);
    
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    const updated = { ...apps[index], ...updates, id };
    apps[index] = updated;
    
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(apps, null, 2));
    return updated;
  }

  static async deleteApplication(id: string): Promise<void> {
    const apps = await this.getAllApplications();
    const filtered = apps.filter(app => app.id !== id);
    
    if (filtered.length === apps.length) {
      throw new Error('Application not found');
    }
    
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(filtered, null, 2));
  }
}
```

#### 2.2 API Routes

**`app/api/applications/route.ts`** - GET all, POST new
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { ApplicationSchema } from '@/lib/types';

export async function GET() {
  try {
    const applications = await Database.getAllApplications();
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const validated = ApplicationSchema.parse(body);
    
    // Save to database
    const created = await Database.createApplication(validated);
    
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
```

**`app/api/applications/[id]/route.ts`** - GET, PUT, DELETE by ID
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { ApplicationSchema } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = await Database.getApplication(params.id);
    
    if (!app) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = ApplicationSchema.partial().parse(body);
    
    const updated = await Database.updateApplication(params.id, validated);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await Database.deleteApplication(params.id);
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
```

**`app/api/analysis/route.ts`** - Run RICE analysis
```typescript
import { NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { analyzePortfolio, generateSummary } from '../../../src/analyzer.js';

export async function POST() {
  try {
    // Get all applications
    const applications = await Database.getAllApplications();
    
    // Run RICE analysis
    const results = analyzePortfolio(applications);
    const summary = generateSummary(results);
    
    // Save results to file
    const resultsPath = path.join(process.cwd(), '../output/latest-analysis.json');
    await fs.writeFile(resultsPath, JSON.stringify({ results, summary }, null, 2));
    
    return NextResponse.json({ results, summary });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to run analysis' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return latest analysis results
    const resultsPath = path.join(process.cwd(), '../output/latest-analysis.json');
    const data = await fs.readFile(resultsPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json(
      { error: 'No analysis results found' },
      { status: 404 }
    );
  }
}
```

#### 2.3 API Client Helper

**`lib/api-client.ts`** - Frontend API calls
```typescript
import { Application, RICEResult } from './types';

const API_BASE = '/api';

export const api = {
  // Applications
  applications: {
    async getAll(): Promise<Application[]> {
      const res = await fetch(`${API_BASE}/applications`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      return res.json();
    },

    async getOne(id: string): Promise<Application> {
      const res = await fetch(`${API_BASE}/applications/${id}`);
      if (!res.ok) throw new Error('Failed to fetch application');
      return res.json();
    },

    async create(data: Application): Promise<Application> {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create application');
      return res.json();
    },

    async update(id: string, data: Partial<Application>): Promise<Application> {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update application');
      return res.json();
    },

    async delete(id: string): Promise<void> {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete application');
    },
  },

  // Analysis
  analysis: {
    async run(): Promise<{ results: RICEResult[]; summary: any }> {
      const res = await fetch(`${API_BASE}/analysis`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to run analysis');
      return res.json();
    },

    async getLatest(): Promise<{ results: RICEResult[]; summary: any }> {
      const res = await fetch(`${API_BASE}/analysis`);
      if (!res.ok) throw new Error('No analysis results found');
      return res.json();
    },
  },
};
```

### Testing Checklist

- [ ] GET /api/applications returns all apps
- [ ] POST /api/applications creates new app
- [ ] GET /api/applications/:id returns single app
- [ ] PUT /api/applications/:id updates app
- [ ] DELETE /api/applications/:id removes app
- [ ] Validation rejects invalid data
- [ ] Error responses have proper status codes
- [ ] POST /api/analysis runs successfully

### Success Criteria

✅ Full CRUD operations working  
✅ Data persists to file system  
✅ Validation prevents bad data  
✅ Analysis integration functional  

---

## Phase 3: Core UI

**Branch:** `feature/phase-3-ui`  
**Timeline:** Week 3 (7 days)  
**Goal:** Build applications table and forms

### Objectives

1. ✅ Create applications table with TanStack Table
2. ✅ Add sorting, filtering, pagination
3. ✅ Build add/edit forms with validation
4. ✅ Implement delete confirmation
5. ✅ Add search functionality
6. ✅ Real-time data updates

### Deliverables

#### 3.1 Applications Table

**`components/applications/ApplicationTable.tsx`**
```tsx
'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Application } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface ApplicationTableProps {
  data: Application[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ApplicationTable({ data, onEdit, onDelete }: ApplicationTableProps) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: 'Application',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Application
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-navy-700">
          {row.getValue('Application')}
        </div>
      ),
    },
    {
      accessorKey: 'Program Name',
      header: 'Program',
    },
    {
      accessorKey: 'Number of Users',
      header: 'Users',
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue<number>('Number of Users').toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'Mission Metrics.Business Criticality',
      header: 'Criticality',
      cell: ({ row }) => {
        const tier = row.original['Mission Metrics']?.['Business Criticality'];
        return tier ? (
          <Badge
            variant={tier === 'Tier 1' ? 'destructive' : tier === 'Tier 2' ? 'default' : 'secondary'}
          >
            {tier}
          </Badge>
        ) : null;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/applications/${row.original.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original.id!)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original.id!)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search applications..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {table.getFilteredRowModel().rows.length} total applications
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
```

#### 3.2 Application Form

**`components/applications/ApplicationForm.tsx`**
```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Application, ApplicationSchema } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (data: Application) => Promise<void>;
  onCancel: () => void;
}

export function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const form = useForm<Application>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: application || {
      Application: '',
      'Program Name': '',
      'Number of Users': 0,
      'Public Access?': 'Unknown',
      'Technology Stack': '',
      'Product Owner': '',
      'Product Contact': '',
      Purpose: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="Application"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Program Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose *</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* More fields... */}
          </TabsContent>

          {/* User Metrics Tab */}
          <TabsContent value="users" className="space-y-4">
            <FormField
              control={form.control}
              name="Number of Users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Users *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="User Metrics.Geographic Scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geographic Scope</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="National">National</SelectItem>
                      <SelectItem value="Regional">Regional</SelectItem>
                      <SelectItem value="Local">Local</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* More tabs... */}
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-navy-500 hover:bg-navy-600">
            {application ? 'Update' : 'Create'} Application
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

#### 3.3 Applications Page

**`app/applications/page.tsx`**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { ApplicationTable } from '@/components/applications/ApplicationTable';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import { Application } from '@/lib/types';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await api.applications.getAll();
      setApplications(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
    }
  };

  const handleCreate = async (data: Application) => {
    try {
      await api.applications.create(data);
      toast({ title: 'Success', description: 'Application created' });
      setIsDialogOpen(false);
      loadApplications();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create application',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (id: string) => {
    const app = applications.find((a) => a.id === id);
    setEditingApp(app);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (data: Application) => {
    try {
      await api.applications.update(editingApp!.id!, data);
      toast({ title: 'Success', description: 'Application updated' });
      setIsDialogOpen(false);
      setEditingApp(undefined);
      loadApplications();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update application',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await api.applications.delete(id);
      toast({ title: 'Success', description: 'Application deleted' });
      loadApplications();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete application',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-800">Applications</h1>
          <p className="text-slate-600 mt-1">
            Manage your application portfolio
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingApp(undefined);
            setIsDialogOpen(true);
          }}
          className="bg-navy-500 hover:bg-navy-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <ApplicationTable
        data={applications}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingApp ? 'Edit' : 'Add'} Application
            </DialogTitle>
          </DialogHeader>
          <ApplicationForm
            application={editingApp}
            onSubmit={editingApp ? handleUpdate : handleCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### Testing Checklist

- [ ] Table displays all applications
- [ ] Sorting works on all columns
- [ ] Search filters results correctly
- [ ] Pagination works
- [ ] Add form creates new application
- [ ] Edit form updates application
- [ ] Delete confirmation prevents accidents
- [ ] Form validation shows errors
- [ ] Success/error toasts display

### Success Criteria

✅ Full CRUD functionality from UI  
✅ Smooth user experience  
✅ Proper validation and error handling  
✅ NOAA-branded UI components  

---

## Phase 4: Analysis & Visualizations

**Branch:** `feature/phase-4-analysis`  
**Timeline:** Week 4 (7 days)  
**Goal:** Build analysis results and visualizations

### Objectives

1. ✅ Analysis results page
2. ✅ Run analysis button with loading state
3. ✅ RICE score charts (bar, pie, scatter)
4. ✅ Priority quadrant view
5. ✅ Export functionality (CSV, PDF)

### Deliverables

#### 4.1 Analysis Page

**`app/analysis/page.tsx`**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { RICEResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, TrendingUp } from 'lucide-react';
import { RICEScoreCard } from '@/components/analysis/RICEScoreCard';
import { PriorityChart } from '@/components/analysis/PriorityChart';

export default function AnalysisPage() {
  const [results, setResults] = useState<RICEResult[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLatestAnalysis();
  }, []);

  const loadLatestAnalysis = async () => {
    try {
      const data = await api.analysis.getLatest();
      setResults(data.results);
      setSummary(data.summary);
    } catch (error) {
      // No previous analysis
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await api.analysis.run();
      setResults(data.results);
      setSummary(data.summary);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    // CSV export logic
    const csv = convertToCSV(results);
    downloadFile(csv, 'rice-analysis.csv', 'text/csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-800">RICE Analysis</h1>
          <p className="text-slate-600 mt-1">
            Application prioritization results
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={!results.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={runAnalysis}
            disabled={loading}
            className="bg-ocean-500 hover:bg-ocean-600"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="mr-2 h-4 w-4" />
            )}
            Run Analysis
          </Button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-700">
                {summary.totalApps}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Avg Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ocean-600">
                {summary.avgRiceScore}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.highPriority}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Low Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-600">
                {summary.lowPriority}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {results.length > 0 && (
        <>
          <PriorityChart data={results} />
          
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Priority Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.slice(0, 10).map((result) => (
                  <RICEScoreCard key={result.application} result={result} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
```

#### 4.2 RICE Score Card

**`components/analysis/RICEScoreCard.tsx`**
```tsx
import { RICEResult } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RICEScoreCardProps {
  result: RICEResult;
}

export function RICEScoreCard({ result }: RICEScoreCardProps) {
  const getPriorityColor = (score: number) => {
    if (score >= 20) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <Card className={`p-4 ${getPriorityColor(result.riceScore)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              #{result.priorityRank}
            </Badge>
            <h3 className="font-semibold">{result.application}</h3>
          </div>
          <p className="text-sm mt-1 opacity-80">{result.program}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {result.riceScore.toFixed(1)}
          </div>
          <div className="text-xs opacity-80">
            R:{result.reach} × I:{result.impact} × C:{result.confidence} / E:{result.effort}
          </div>
        </div>
      </div>
    </Card>
  );
}
```

#### 4.3 Priority Chart

**`components/analysis/PriorityChart.tsx`**
```tsx
'use client';

import { RICEResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PriorityChartProps {
  data: RICEResult[];
}

export function PriorityChart({ data }: PriorityChartProps) {
  const chartData = data.slice(0, 15).map((item) => ({
    name: item.application.length > 20
      ? item.application.substring(0, 20) + '...'
      : item.application,
    score: item.riceScore,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>RICE Scores - Top 15 Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#0085CA" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

#### 4.4 Quadrant View

**`app/visualizations/page.tsx`**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { RICEResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export default function VisualizationsPage() {
  const [results, setResults] = useState<RICEResult[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await api.analysis.getLatest();
      setResults(data.results);
    } catch (error) {
      console.error('Failed to load results');
    }
  };

  const quadrantData = results.map((item) => ({
    name: item.application,
    impact: item.impact,
    effort: item.effort,
    score: item.riceScore,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-navy-800">Visualizations</h1>

      <Card>
        <CardHeader>
          <CardTitle>Priority Quadrant - Impact vs Effort</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="effort"
                name="Effort"
                domain={[0, 6]}
                label={{ value: 'Effort', position: 'bottom' }}
              />
              <YAxis
                type="number"
                dataKey="impact"
                name="Impact"
                domain={[0, 6]}
                label={{ value: 'Impact', angle: -90, position: 'left' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <ReferenceLine x={3} stroke="#94a3b8" strokeDasharray="3 3" />
              <ReferenceLine y={3} stroke="#94a3b8" strokeDasharray="3 3" />
              <Scatter
                data={quadrantData}
                fill="#0085CA"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Add more visualizations */}
    </div>
  );
}
```

### Testing Checklist

- [ ] Run analysis button triggers analysis
- [ ] Loading state shows during analysis
- [ ] Results display correctly
- [ ] Charts render properly
- [ ] Quadrant view shows all apps
- [ ] Export CSV downloads correctly
- [ ] Top 10 list is accurate

### Success Criteria

✅ Analysis runs successfully  
✅ Beautiful, informative visualizations  
✅ Export functionality works  
✅ Fast, responsive UI  

---

## Phase 5: Polish & Deploy

**Branch:** `feature/phase-5-deploy`  
**Timeline:** Week 5 (5 days)  
**Goal:** Final polish and deployment

### Objectives

1. ✅ Gap analysis page
2. ✅ Responsive design refinement
3. ✅ Loading states and optimistic updates
4. ✅ Error boundaries
5. ✅ Production build optimization
6. ✅ Deploy to cloud platform

### Deliverables

#### 5.1 Gap Analysis Page

**`app/data-quality/page.tsx`**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { Application } from '@/lib/types';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function DataQualityPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const apps = await api.applications.getAll();
    setApplications(apps);
    
    // Calculate data quality for each app
    const analysis = apps.map((app) => ({
      name: app.Application,
      completeness: calculateCompleteness(app),
      missingFields: getMissingFields(app),
    }));
    
    setGapAnalysis(analysis.sort((a, b) => a.completeness - b.completeness));
  };

  const calculateCompleteness = (app: Application): number => {
    let score = 0;
    let total = 0;

    // Check required fields
    const required = [
      'Application',
      'Program Name',
      'Purpose',
      'Product Owner',
      'Number of Users',
      'Technology Stack',
    ];

    required.forEach((field) => {
      total += 1;
      if (app[field as keyof Application]) score += 1;
    });

    // Check optional but important fields
    const optional = ['User Metrics', 'Mission Metrics', 'Resource Metrics'];

    optional.forEach((field) => {
      total += 1;
      if (app[field as keyof Application]) score += 1;
    });

    return Math.round((score / total) * 100);
  };

  const getMissingFields = (app: Application): string[] => {
    const missing: string[] = [];

    if (!app['User Metrics']) missing.push('User Metrics');
    if (!app['Mission Metrics']) missing.push('Mission Metrics');
    if (!app['Resource Metrics']?.['FTE Dedicated']) missing.push('FTE Dedicated');
    if (!app['Resource Metrics']?.['Support Tickets Annual']) missing.push('Support Tickets');

    return missing;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800">Data Quality</h1>
        <p className="text-slate-600 mt-1">
          Identify gaps and improve data completeness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Excellent Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {gapAnalysis.filter((a) => a.completeness >= 90).length}
            </div>
            <p className="text-xs text-slate-600 mt-1">≥ 90% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Needs Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {gapAnalysis.filter((a) => a.completeness >= 50 && a.completeness < 90).length}
            </div>
            <p className="text-xs text-slate-600 mt-1">50-89% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Critical Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {gapAnalysis.filter((a) => a.completeness < 50).length}
            </div>
            <p className="text-xs text-slate-600 mt-1">&lt; 50% complete</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Data Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gapAnalysis.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.completeness >= 90 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <Badge
                    variant={
                      item.completeness >= 90
                        ? 'default'
                        : item.completeness >= 50
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {item.completeness}%
                  </Badge>
                </div>
                <Progress value={item.completeness} className="h-2" />
                {item.missingFields.length > 0 && (
                  <p className="text-xs text-slate-600">
                    Missing: {item.missingFields.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 5.2 Error Boundary

**`components/common/ErrorBoundary.tsx`**
```tsx
'use client';

import { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-navy-500 hover:bg-navy-600"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### 5.3 Production Build

**`next.config.js`**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'RICE Framework',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

module.exports = nextConfig;
```

#### 5.4 Deployment Scripts

**`package.json` scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Deployment Options

#### Option 1: Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

#### Option 2: Docker + Cloud Run
```bash
# Build image
docker build -t rice-framework:latest .

# Test locally
docker run -p 3000:3000 rice-framework:latest

# Push to Google Container Registry
docker tag rice-framework:latest gcr.io/PROJECT_ID/rice-framework:latest
docker push gcr.io/PROJECT_ID/rice-framework:latest

# Deploy to Cloud Run
gcloud run deploy rice-framework \
  --image gcr.io/PROJECT_ID/rice-framework:latest \
  --platform managed \
  --region us-east1 \
  --allow-unauthenticated
```

#### Option 3: NOAA Cloud
```bash
# Follow NOAA Cloud.gov deployment guidelines
cf push rice-framework
```

### Testing Checklist

- [ ] All pages load without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error boundaries catch errors gracefully
- [ ] Production build runs successfully
- [ ] Environment variables configured
- [ ] Data quality page shows accurate metrics
- [ ] Loading states improve UX
- [ ] Deployment successful

### Success Criteria

✅ Professional, polished UI  
✅ Fast performance  
✅ Deployed to production  
✅ Accessible to NOAA staff  

---

## API Specifications

### REST API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/applications` | List all applications | - | `Application[]` |
| POST | `/api/applications` | Create application | `Application` | `Application` |
| GET | `/api/applications/:id` | Get one application | - | `Application` |
| PUT | `/api/applications/:id` | Update application | `Partial<Application>` | `Application` |
| DELETE | `/api/applications/:id` | Delete application | - | `{ success: true }` |
| POST | `/api/analysis` | Run RICE analysis | - | `{ results, summary }` |
| GET | `/api/analysis` | Get latest results | - | `{ results, summary }` |

### Error Responses

```json
{
  "error": "Error message",
  "details": [] // Optional validation errors
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 204: No Content (delete)
- 400: Bad Request (validation)
- 404: Not Found
- 500: Server Error

---

## Component Library

### shadcn/ui Components Used

```bash
# Core UI
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tooltip

# Forms
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group

# Tables
npx shadcn-ui@latest add table

# Navigation
npx shadcn-ui@latest add tabs

# Feedback
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
```

### Custom Components

- `ApplicationTable` - Data table with sorting/filtering
- `ApplicationForm` - Multi-tab CRUD form
- `RICEScoreCard` - Analysis result card
- `PriorityChart` - Bar chart visualization
- `QuadrantView` - Scatter plot
- `DataQualityBadge` - Data completeness indicator
- `LoadingSpinner` - Loading state
- `ErrorBoundary` - Error catching

---

## Testing Strategy

### Unit Testing (Jest + React Testing Library)

```bash
# Install testing deps
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jest-environment-jsdom
```

**Example test:**
```typescript
// __tests__/components/RICEScoreCard.test.tsx
import { render, screen } from '@testing-library/react';
import { RICEScoreCard } from '@/components/analysis/RICEScoreCard';

describe('RICEScoreCard', () => {
  it('displays RICE score correctly', () => {
    const result = {
      application: 'Test App',
      riceScore: 42.5,
      // ... other fields
    };

    render(<RICEScoreCard result={result} />);
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('42.5')).toBeInTheDocument();
  });
});
```

### Integration Testing

Test full user flows:
1. Create application → View in table
2. Edit application → See changes
3. Delete application → Confirm removal
4. Run analysis → View results
5. Export CSV → Download file

### E2E Testing (Playwright - Optional)

```bash
npm install -D @playwright/test
npx playwright install
```

### Manual Testing Checklist

**Per Phase:**
- [ ] All pages accessible
- [ ] Forms validate correctly
- [ ] API calls succeed
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Responsive on all devices
- [ ] NOAA colors correct
- [ ] No console errors

---

## Deployment Guide

### Environment Variables

Create `.env.local`:
```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="RICE Framework"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration (if external)
API_URL="http://localhost:3000"

# Analytics (optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Production build successful
- [ ] All tests passing
- [ ] Security headers configured
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Analytics configured (optional)
- [ ] SSL certificate installed
- [ ] Domain name configured

### Post-Deployment Verification

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] API endpoints responding
- [ ] Data persists correctly
- [ ] Forms submit successfully
- [ ] Analysis runs successfully
- [ ] Export functionality works
- [ ] Mobile responsive
- [ ] NOAA branding correct

### Monitoring

**Metrics to track:**
- Page load time
- API response time
- Error rate
- User engagement
- Analysis run frequency

**Tools:**
- Vercel Analytics (if using Vercel)
- Google Analytics (if approved)
- Sentry (error tracking)
- LogRocket (session replay)

---

## Maintenance & Updates

### Regular Tasks

**Weekly:**
- Review error logs
- Check user feedback
- Monitor performance metrics

**Monthly:**
- Update dependencies (`npm update`)
- Review and optimize queries
- Backup data files

**Quarterly:**
- Security audit
- Performance optimization
- Feature requests review

### Upgrade Path

**Future enhancements:**
1. Multi-user authentication (ICAM)
2. Real-time collaboration
3. Advanced filtering
4. Custom report builder
5. Email notifications
6. API integrations (ServiceNow, JIRA)
7. Historical trend analysis
8. AI-powered suggestions

---

## Appendix

### Keyboard Shortcuts

Implement these for power users:

- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + N` - New application
- `Ctrl/Cmd + R` - Run analysis
- `Ctrl/Cmd + E` - Export data
- `Ctrl/Cmd + /` - Show shortcuts

### Accessibility

- All interactive elements keyboard accessible
- Proper ARIA labels
- Color contrast meets WCAG AA
- Screen reader friendly
- Focus indicators visible

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

---

## Glossary

- **RICE** - Reach, Impact, Confidence, Effort framework
- **NOAA** - National Oceanic and Atmospheric Administration
- **OCIO** - Office of the Chief Information Officer
- **FTE** - Full-Time Equivalent
- **RTO** - Recovery Time Objective
- **RPO** - Recovery Point Objective
- **CRUD** - Create, Read, Update, Delete

---

**Plan Version:** 1.0  
**Last Updated:** April 2026  
**Maintained By:** NOAA Fisheries OCIO
