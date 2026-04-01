# RICE Framework - Frontend Implementation Plan (UPDATED)

**Project:** Application RICE Framework Web UI  
**Framework:** Next.js 14 + Tailwind CSS + shadcn/ui  
**Branding:** NOAA Official Colors  
**Date:** April 2026  
**Version:** 2.0 (Updated Post-Phase 4)

---

## 📋 Implementation Status

### ✅ **COMPLETED** - Phases 1-3 + Partial Phase 4

| Phase | Status | Features |
|-------|--------|----------|
| **Phase 1: Foundation** | ✅ **COMPLETE** | Next.js 14, Tailwind, NOAA branding, routing, TypeScript |
| **Phase 2: Data Layer** | ✅ **COMPLETE** | CRUD APIs, SQLite, validation, error handling |
| **Phase 3: Core UI** | ✅ **COMPLETE** | Applications table, forms, search, full CRUD |
| **Phase 4: Analysis** | 🟡 **PARTIAL** | Analysis page working, visualization removed |
| **Phase 5: Polish & Deploy** | ❌ **NOT STARTED** | Data quality, export, deployment pending |

---

## 🎯 Remaining Work Overview

### Phase 4 (Continued): Visualizations with Google Charts
- Dashboard with 4-quadrant scatter plot
- Interactive tooltips
- Color-coded by priority
- Responsive charts

### Phase 5: Polish, Features & Deploy
- Data Quality page (gap analysis)
- Export to CSV/PDF
- Error boundaries
- Mobile optimization
- Production deployment

---

## Phase 4 (Continued): Dashboard & Visualizations

**Branch:** `feature/phase-4-visualizations`  
**Timeline:** 2-3 days  
**Status:** ❌ Not Started

### Why Google Charts?

**Advantages over Recharts:**
- ✅ No SSR/compilation issues (loads via CDN)
- ✅ Proven stability in production
- ✅ Extensive customization options
- ✅ Free and Google-hosted
- ✅ Great documentation
- ✅ Perfect for scatter plots

### Objectives

1. ❌ Add Google Charts to dashboard page
2. ❌ Create 4-quadrant scatter plot (Impact vs Effort)
3. ❌ Add interactive tooltips showing app details
4. ❌ Color-code points by RICE score priority
5. ❌ Add quadrant labels and reference lines
6. ❌ Make charts responsive
7. ❌ Show real-time data from latest analysis

### Deliverables

#### 4.1 Google Charts Integration

**Add Google Charts to `app/layout.tsx` or `app/page.tsx`:**

```tsx
// Add to <head> in layout or use next/script
<Script
  src="https://www.gstatic.com/charts/loader.js"
  strategy="beforeInteractive"
/>
```

#### 4.2 Dashboard with 4-Quadrant Visualization

**Update `app/page.tsx` - Enhanced Dashboard:**

```tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, TrendingUp, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api-client';
import { RICEResult } from '@/lib/types';

declare global {
  interface Window {
    google: any;
  }
}

export default function Dashboard() {
  const [results, setResults] = useState<RICEResult[]>([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google Charts
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(() => {
        setGoogleLoaded(true);
      });
    };
    document.head.appendChild(script);

    loadAnalysis();

    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (googleLoaded && results.length > 0) {
      drawChart();
    }
  }, [googleLoaded, results]);

  const loadAnalysis = async () => {
    try {
      const data = await api.analysis.getLatest();
      setResults(data.results || []);
    } catch (error) {
      console.log('No analysis data yet');
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await api.analysis.run();
      setResults(data.results || []);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const drawChart = () => {
    if (!chartRef.current || !window.google) return;

    // Prepare data for Google Charts
    const data = new window.google.visualization.DataTable();
    data.addColumn('number', 'Effort');
    data.addColumn('number', 'Impact');
    data.addColumn('string', 'Application');
    data.addColumn('number', 'RICE Score');
    data.addColumn({ type: 'string', role: 'style' });
    data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });

    results.forEach((result) => {
      const color = result.riceScore >= 20 ? '#10b981' : // Green
                    result.riceScore >= 10 ? '#3b82f6' : // Blue
                    '#94a3b8'; // Gray
      
      const tooltip = `<div style="padding: 12px; max-width: 300px;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${result.application}</div>
        <div style="color: #64748b; font-size: 12px; margin-bottom: 8px;">${result.program}</div>
        <hr style="margin: 8px 0; border: none; border-top: 1px solid #e2e8f0;">
        <div style="font-size: 13px; line-height: 1.6;">
          <div><strong>RICE Score:</strong> ${result.riceScore.toFixed(1)}</div>
          <div><strong>Impact:</strong> ${result.impact}/5</div>
          <div><strong>Effort:</strong> ${result.effort}/5</div>
          <div><strong>Reach:</strong> ${result.reach}/5</div>
          <div><strong>Confidence:</strong> ${result.confidence}/5</div>
        </div>
      </div>`;

      data.addRow([
        result.effort,
        result.impact,
        result.application,
        result.riceScore,
        `point { size: 8; fill-color: ${color}; }`,
        tooltip
      ]);
    });

    const options = {
      title: 'Priority Quadrant: Impact vs Effort',
      titleTextStyle: {
        fontSize: 18,
        bold: true,
        color: '#1e293b'
      },
      hAxis: {
        title: 'Effort (Higher = More Effort)',
        minValue: 0,
        maxValue: 5,
        gridlines: { color: '#f1f5f9' },
        baseline: 2.5,
        baselineColor: '#94a3b8'
      },
      vAxis: {
        title: 'Impact (Higher = More Impact)',
        minValue: 0,
        maxValue: 5,
        gridlines: { color: '#f1f5f9' },
        baseline: 2.5,
        baselineColor: '#94a3b8'
      },
      legend: 'none',
      tooltip: { isHtml: true },
      backgroundColor: '#ffffff',
      chartArea: {
        width: '80%',
        height: '75%'
      },
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        axis: 'horizontal',
        keepInBounds: true
      }
    };

    const chart = new window.google.visualization.ScatterChart(chartRef.current);
    chart.draw(data, options);
  };

  // Calculate summary stats
  const totalApps = results.length;
  const avgScore = totalApps > 0 
    ? (results.reduce((sum, r) => sum + r.riceScore, 0) / totalApps).toFixed(1)
    : '0';
  const highPriority = results.filter(r => r.riceScore >= 20).length;
  const needsAttention = results.filter(r => r.riceScore < 10).length;

  // Quadrant counts
  const quickWins = results.filter(r => r.impact > 2.5 && r.effort < 2.5).length;
  const majorProjects = results.filter(r => r.impact > 2.5 && r.effort >= 2.5).length;
  const fillIns = results.filter(r => r.impact <= 2.5 && r.effort < 2.5).length;
  const thanklessTasks = results.filter(r => r.impact <= 2.5 && r.effort >= 2.5).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Application Portfolio Management Overview
          </p>
        </div>
        <Button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-ocean-500 hover:bg-ocean-600"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <TrendingUp className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Running...' : 'Run Analysis'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Database className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-700">{totalApps}</div>
            <p className="text-xs text-slate-600 mt-1">In portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average RICE Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-ocean-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ocean-600">{avgScore}</div>
            <p className="text-xs text-slate-600 mt-1">Across all apps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{highPriority}</div>
            <p className="text-xs text-slate-600 mt-1">Score ≥ 20</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{needsAttention}</div>
            <p className="text-xs text-slate-600 mt-1">Score &lt; 10</p>
          </CardContent>
        </Card>
      </div>

      {/* 4-Quadrant Visualization */}
      {results.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Priority Quadrant Analysis</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Interactive chart showing applications by Impact vs Effort
              </p>
            </CardHeader>
            <CardContent>
              <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>
              
              {/* Quadrant Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-green-900 text-sm">Quick Wins</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{quickWins}</div>
                  <p className="text-xs text-green-700">High Impact, Low Effort</p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-semibold text-blue-900 text-sm">Major Projects</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{majorProjects}</div>
                  <p className="text-xs text-blue-700">High Impact, High Effort</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                    <span className="font-semibold text-slate-900 text-sm">Fill Ins</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-600">{fillIns}</div>
                  <p className="text-xs text-slate-700">Low Impact, Low Effort</p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="font-semibold text-amber-900 text-sm">Rationalization</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">{thanklessTasks}</div>
                  <p className="text-xs text-amber-700">Low Impact, High Effort</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Quick Wins (Top 5)</CardTitle>
                <p className="text-sm text-slate-600">High impact, low effort - prioritize these!</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results
                    .filter(r => r.impact > 2.5 && r.effort < 2.5)
                    .sort((a, b) => b.riceScore - a.riceScore)
                    .slice(0, 5)
                    .map((r, idx) => (
                      <div key={r.application} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-green-900">{idx + 1}. {r.application}</div>
                          <div className="text-xs text-green-700">{r.program}</div>
                        </div>
                        <Badge className="bg-green-600">{r.riceScore.toFixed(1)}</Badge>
                      </div>
                    ))}
                  {results.filter(r => r.impact > 2.5 && r.effort < 2.5).length === 0 && (
                    <p className="text-sm text-slate-500 italic">No quick wins identified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚠️ Rationalization Candidates (Top 5)</CardTitle>
                <p className="text-sm text-slate-600">Low impact, high effort - consider alternatives</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results
                    .filter(r => r.impact <= 2.5 && r.effort >= 2.5)
                    .sort((a, b) => a.riceScore - b.riceScore)
                    .slice(0, 5)
                    .map((r, idx) => (
                      <div key={r.application} className="flex justify-between items-center p-2 bg-amber-50 rounded border border-amber-200">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-amber-900">{idx + 1}. {r.application}</div>
                          <div className="text-xs text-amber-700">{r.program}</div>
                        </div>
                        <Badge variant="outline" className="border-amber-600 text-amber-600">{r.riceScore.toFixed(1)}</Badge>
                      </div>
                    ))}
                  {results.filter(r => r.impact <= 2.5 && r.effort >= 2.5).length === 0 && (
                    <p className="text-sm text-slate-500 italic">No rationalization candidates identified</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Quick Actions - Show if no analysis */}
      {results.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              Start by viewing your{' '}
              <a href="/applications" className="text-ocean-600 hover:text-ocean-700 underline">
                applications
              </a>{' '}
              or click "Run Analysis" above to generate RICE scores.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Testing Checklist

- [ ] Google Charts loads from CDN
- [ ] Dashboard displays without errors
- [ ] 4-quadrant scatter plot renders
- [ ] Tooltips show app details on hover
- [ ] Points are color-coded by priority
- [ ] Quadrant labels display correctly
- [ ] Reference lines at x=2.5, y=2.5
- [ ] Chart is responsive
- [ ] Run Analysis button updates chart
- [ ] Summary cards show correct counts

### Success Criteria

✅ Beautiful, interactive 4-quadrant visualization  
✅ No SSR/compilation errors  
✅ Tooltips provide rich app information  
✅ Clear visual priority indicators  
✅ Responsive across devices  

---

## Phase 5: Polish, Features & Deploy

**Branch:** `feature/phase-5-polish-deploy`  
**Timeline:** 3-5 days  
**Status:** ❌ Not Started

### Objectives

1. ❌ Data Quality page with gap analysis
2. ❌ Export to CSV and PDF functionality
3. ❌ Error boundaries for graceful errors
4. ❌ Mobile responsive optimization
5. ❌ Loading states and optimistic updates
6. ❌ Production build optimization
7. ❌ Deployment to cloud platform

### Deliverables

#### 5.1 Data Quality Page

**Create `app/data-quality/page.tsx`:**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Application } from '@/lib/types';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Download } from 'lucide-react';

interface GapAnalysis {
  application: string;
  completeness: number;
  missingFields: string[];
  hasUserMetrics: boolean;
  hasMissionMetrics: boolean;
  hasResourceMetrics: boolean;
  dataQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export default function DataQualityPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await api.applications.getAll();
      setApplications(apps);
      
      const analysis = apps.map(calculateGaps).sort((a, b) => a.completeness - b.completeness);
      setGapAnalysis(analysis);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGaps = (app: Application): GapAnalysis => {
    const missingFields: string[] = [];
    let totalFields = 0;
    let filledFields = 0;

    // Required basic fields
    const basicFields = {
      'Application': app.Application,
      'Program Name': app['Program Name'],
      'Purpose': app.Purpose,
      'Product Owner': app['Product Owner'],
      'Product Contact': app['Product Contact'],
      'Technology Stack': app['Technology Stack'],
      'Number of Users': app['Number of Users'],
    };

    Object.entries(basicFields).forEach(([key, value]) => {
      totalFields++;
      if (value && value !== '' && value !== 0) {
        filledFields++;
      } else {
        missingFields.push(key);
      }
    });

    // Check for metrics
    const hasUserMetrics = !!app['User Metrics'];
    const hasMissionMetrics = !!app['Mission Metrics'];
    const hasResourceMetrics = !!app['Resource Metrics'];

    totalFields += 3;
    if (hasUserMetrics) filledFields++;
    else missingFields.push('User Metrics');
    
    if (hasMissionMetrics) filledFields++;
    else missingFields.push('Mission Metrics');
    
    if (hasResourceMetrics) filledFields++;
    else missingFields.push('Resource Metrics');

    const completeness = Math.round((filledFields / totalFields) * 100);
    
    const dataQuality: GapAnalysis['dataQuality'] = 
      completeness >= 90 ? 'Excellent' :
      completeness >= 70 ? 'Good' :
      completeness >= 50 ? 'Fair' : 'Poor';

    return {
      application: app.Application,
      completeness,
      missingFields,
      hasUserMetrics,
      hasMissionMetrics,
      hasResourceMetrics,
      dataQuality
    };
  };

  const exportGapReport = () => {
    const csv = [
      ['Application', 'Completeness %', 'Data Quality', 'Missing Fields'],
      ...gapAnalysis.map(g => [
        g.application,
        g.completeness.toString(),
        g.dataQuality,
        g.missingFields.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-quality-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const excellent = gapAnalysis.filter(a => a.dataQuality === 'Excellent').length;
  const good = gapAnalysis.filter(a => a.dataQuality === 'Good').length;
  const fair = gapAnalysis.filter(a => a.dataQuality === 'Fair').length;
  const poor = gapAnalysis.filter(a => a.dataQuality === 'Poor').length;
  const avgCompleteness = gapAnalysis.length > 0
    ? Math.round(gapAnalysis.reduce((sum, a) => sum + a.completeness, 0) / gapAnalysis.length)
    : 0;

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-800">Data Quality</h1>
          <p className="text-slate-600 mt-1">
            Identify gaps and improve data completeness
          </p>
        </div>
        <Button onClick={exportGapReport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Completeness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-700">{avgCompleteness}%</div>
            <Progress value={avgCompleteness} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Excellent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{excellent}</div>
            <p className="text-xs text-slate-600 mt-1">≥ 90% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Good</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{good}</div>
            <p className="text-xs text-slate-600 mt-1">70-89% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Fair</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{fair}</div>
            <p className="text-xs text-slate-600 mt-1">50-69% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Poor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{poor}</div>
            <p className="text-xs text-slate-600 mt-1">&lt; 50% complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Gap Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Application Data Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gapAnalysis.map((item) => (
              <div key={item.application} className="space-y-2 pb-4 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {item.completeness >= 90 ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    )}
                    <span className="font-medium text-navy-800">{item.application}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{item.completeness}%</span>
                    <Badge
                      className={
                        item.dataQuality === 'Excellent' ? 'bg-green-100 text-green-800' :
                        item.dataQuality === 'Good' ? 'bg-blue-100 text-blue-800' :
                        item.dataQuality === 'Fair' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {item.dataQuality}
                    </Badge>
                  </div>
                </div>
                
                <Progress value={item.completeness} className="h-2" />
                
                {item.missingFields.length > 0 && (
                  <div className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="font-medium">Missing:</span>
                    <span className="flex-1">{item.missingFields.join(', ')}</span>
                  </div>
                )}

                {/* Metrics Status */}
                <div className="flex gap-2 text-xs">
                  <Badge variant={item.hasUserMetrics ? 'default' : 'outline'}>
                    User Metrics {item.hasUserMetrics ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={item.hasMissionMetrics ? 'default' : 'outline'}>
                    Mission Metrics {item.hasMissionMetrics ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={item.hasResourceMetrics ? 'default' : 'outline'}>
                    Resource Metrics {item.hasResourceMetrics ? '✓' : '✗'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Add Data Quality to Sidebar:**

Update `components/layout/Sidebar.tsx` to include:
```tsx
{ name: 'Data Quality', href: '/data-quality', icon: CheckCircle2 }
```

#### 5.2 Export Functionality

**Add to Analysis Page (`app/analysis/page.tsx`):**

```tsx
const exportToCSV = () => {
  const csv = [
    ['Rank', 'Application', 'Program', 'RICE Score', 'Reach', 'Impact', 'Confidence', 'Effort'],
    ...results.map(r => [
      r.priorityRank,
      r.application,
      r.program,
      r.riceScore.toFixed(2),
      r.reach,
      r.impact,
      r.confidence,
      r.effort
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rice-analysis-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToPDF = async () => {
  // Using jsPDF library
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('RICE Analysis Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  let y = 45;
  results.slice(0, 20).forEach((result, idx) => {
    doc.text(`${idx + 1}. ${result.application}`, 20, y);
    doc.text(`Score: ${result.riceScore.toFixed(1)}`, 160, y);
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  
  doc.save(`rice-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
};
```

#### 5.3 Error Boundaries

**Create `components/ErrorBoundary.tsx`:**

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
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-lg">
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
              {this.state.error && (
                <details className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
                  <summary className="cursor-pointer font-medium">Error details</summary>
                  <pre className="mt-2 overflow-auto">{this.state.error.message}</pre>
                </details>
              )}
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

**Wrap app in `app/layout.tsx`:**
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

// ... in return
<ErrorBoundary>
  {children}
</ErrorBoundary>
```

#### 5.4 Mobile Optimization

**Key responsive improvements:**

```css
/* globals.css additions */
@media (max-width: 768px) {
  /* Stack sidebar above content on mobile */
  .app-layout {
    flex-direction: column;
  }
  
  /* Smaller cards on mobile */
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  /* Reduce chart height on mobile */
  .chart-container {
    height: 300px !important;
  }
  
  /* Smaller text in tables */
  table {
    font-size: 0.875rem;
  }
}
```

**Responsive Sidebar:**
- Collapsible on mobile
- Hamburger menu
- Full-width when open

#### 5.5 Production Build

**Install dependencies:**
```bash
cd frontend
npm install jspdf  # For PDF export
```

**Build for production:**
```bash
npm run build
npm start  # Test production build
```

**Optimize `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
```

#### 5.6 Deployment

**Option 1: Vercel (Recommended)**
```bash
npm i -g vercel
cd frontend
vercel  # Deploy
vercel --prod  # Production
```

**Option 2: Docker + Cloud Run**
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
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

```bash
# Build and deploy
docker build -t rice-framework .
docker run -p 3000:3000 rice-framework

# Or push to GCR and deploy to Cloud Run
gcloud run deploy rice-framework --source .
```

### Testing Checklist

- [ ] Data Quality page shows gap analysis
- [ ] Export to CSV works
- [ ] Export to PDF works (optional)
- [ ] Error boundaries catch errors
- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768px-1024px)
- [ ] Loading states improve UX
- [ ] Production build runs without errors
- [ ] Deployment successful
- [ ] All pages accessible in production
- [ ] Google Charts load in production
- [ ] Data persists correctly

### Success Criteria

✅ Professional data quality tracking  
✅ Export functionality working  
✅ Graceful error handling  
✅ Perfect mobile experience  
✅ Deployed to production  
✅ Fast, optimized performance  

---

## Summary of Changes from v1.0

### What Changed

1. **Phase 4 Visualization** - Switched from Recharts to Google Charts
   - ✅ No SSR issues
   - ✅ Better stability
   - ✅ Rich tooltips
   - ✅ Interactive scatter plots

2. **Added Data Quality Page** - New feature for gap analysis
   - Track completeness per app
   - Identify missing fields
   - Export gap report

3. **Export Functionality** - CSV and PDF download
   - Analysis results export
   - Gap analysis report export

4. **Enhanced Mobile Experience** - Better responsive design
   - Collapsible sidebar
   - Optimized charts for mobile
   - Touch-friendly controls

5. **Error Handling** - Production-ready error boundaries
   - Graceful error messages
   - Debug information in dev
   - Prevent full app crashes

### Implementation Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 4: Google Charts Dashboard | 2-3 days | 🔴 HIGH |
| Phase 5: Data Quality Page | 1-2 days | 🟡 MEDIUM |
| Phase 5: Export Functionality | 1 day | 🟡 MEDIUM |
| Phase 5: Error Boundaries | 0.5 day | 🟢 LOW |
| Phase 5: Mobile Optimization | 1 day | 🟡 MEDIUM |
| Phase 5: Deployment | 0.5 day | 🔴 HIGH |

**Total estimated time: 6-8 days**

---

## Next Steps

1. **Review this updated plan** - Ensure alignment with requirements
2. **Create feature branches** - `feature/phase-4-visualizations` and `feature/phase-5-polish-deploy`
3. **Implement Phase 4** - Dashboard with Google Charts
4. **Test thoroughly** - All browsers and devices
5. **Implement Phase 5** - Data quality, export, polish
6. **Deploy to production** - Make it live!

---

**Plan Version:** 2.0 (Updated)  
**Last Updated:** April 1, 2026  
**Status:** Phases 1-3 Complete, Phase 4-5 Remaining  
**Maintained By:** NOAA Fisheries OCIO
