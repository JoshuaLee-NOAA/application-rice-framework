'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RICEResult } from '@/lib/types';

export default function AnalysisPage() {
  const [results, setResults] = useState<RICEResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // Load cached analysis on mount
  useEffect(() => {
    loadCachedAnalysis();
  }, []);

  const loadCachedAnalysis = async () => {
    try {
      const response = await fetch('/api/analysis');
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setAnalyzed(true);
      }
    } catch (error) {
      console.log('No cached analysis found');
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analysis');
      const data = await response.json();
      setResults(data.results || []);
      setAnalyzed(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (score: number) => {
    if (score >= 75) return { label: 'High', variant: 'default' as const, icon: TrendingUp };
    if (score >= 25) return { label: 'Medium', variant: 'secondary' as const, icon: Minus };
    return { label: 'Low', variant: 'outline' as const, icon: TrendingDown };
  };

  const stats = {
    total: results.length,
    high: results.filter(r => r.riceScore >= 75).length,
    medium: results.filter(r => r.riceScore >= 25 && r.riceScore < 75).length,
    low: results.filter(r => r.riceScore < 25).length,
    avgScore: results.length > 0 
      ? (results.reduce((sum, r) => sum + r.riceScore, 0) / results.length).toFixed(1)
      : '0',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-800">RICE Analysis</h1>
          <p className="text-slate-600 mt-1">
            Prioritize your application portfolio using the RICE framework
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={runAnalysis}
            disabled={loading}
            className="bg-navy-500 hover:bg-navy-600"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Analysis
              </>
            )}
          </Button>
          {analyzed && (
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {!analyzed ? (
        <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <RefreshCw className="w-16 h-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No Analysis Yet
          </h3>
          <p className="text-slate-500 mb-6 text-center max-w-md">
            Click "Run Analysis" to calculate RICE scores for your applications
            based on Reach, Impact, Confidence, and Effort metrics.
          </p>
          <Button onClick={runAnalysis} className="bg-navy-500 hover:bg-navy-600">
            <RefreshCw className="mr-2 h-4 w-4" />
            Run Analysis
          </Button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-sm font-medium text-slate-600 mb-1">Total Applications</div>
              <div className="text-3xl font-bold text-navy-800">{stats.total}</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
              <div className="text-sm font-medium text-green-700 mb-1">High Priority</div>
              <div className="text-3xl font-bold text-green-600">{stats.high}</div>
              <div className="text-xs text-slate-500 mt-1">Score ≥ 75</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-yellow-200 shadow-sm">
              <div className="text-sm font-medium text-yellow-700 mb-1">Medium Priority</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.medium}</div>
              <div className="text-xs text-slate-500 mt-1">Score 25-74</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-red-200 shadow-sm">
              <div className="text-sm font-medium text-red-700 mb-1">Low Priority</div>
              <div className="text-3xl font-bold text-red-600">{stats.low}</div>
              <div className="text-xs text-slate-500 mt-1">Score &lt; 25</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-navy-200 shadow-sm">
              <div className="text-sm font-medium text-navy-700 mb-1">Avg RICE Score</div>
              <div className="text-3xl font-bold text-navy-600">{stats.avgScore}</div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-navy-700">Rank</TableHead>
                    <TableHead className="font-semibold text-navy-700">Application</TableHead>
                    <TableHead className="font-semibold text-navy-700">Program</TableHead>
                    <TableHead className="font-semibold text-navy-700 text-right">RICE Score</TableHead>
                    <TableHead className="font-semibold text-navy-700">Priority</TableHead>
                    <TableHead className="font-semibold text-navy-700 text-right">Reach</TableHead>
                    <TableHead className="font-semibold text-navy-700 text-right">Impact</TableHead>
                    <TableHead className="font-semibold text-navy-700 text-right">Confidence</TableHead>
                    <TableHead className="font-semibold text-navy-700 text-right">Effort</TableHead>
                    <TableHead className="font-semibold text-navy-700">Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => {
                    const priority = getPriorityBadge(result.riceScore);
                    const PriorityIcon = priority.icon;
                    
                    return (
                      <TableRow key={`${result.application}-${result.priorityRank}-${index}`} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-navy-700">
                          #{result.priorityRank}
                        </TableCell>
                        <TableCell className="font-medium min-w-[200px]">
                          {result.application}
                        </TableCell>
                        <TableCell className="min-w-[140px]">{result.program}</TableCell>
                        <TableCell className="text-right font-bold text-navy-700">
                          {result.riceScore.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={priority.variant} className="gap-1">
                            <PriorityIcon className="h-3 w-3" />
                            {priority.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{result.reach.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{result.impact.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{result.confidence.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{result.effort.toFixed(1)}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded ${
                            result.isFullyQuantitative 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.isFullyQuantitative ? 'Quantitative' : 'Qualitative'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
