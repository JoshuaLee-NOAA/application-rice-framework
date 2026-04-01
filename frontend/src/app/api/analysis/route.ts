import { NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { analyzePortfolio, generateSummary } from '@/lib/analyzer/analyzer';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    // Get all applications
    const applications = await Database.getAllApplications();
    
    // Run RICE analysis
    const results = analyzePortfolio(applications);
    const summary = generateSummary(results);
    
    // Save results to output directory
    const outputDir = path.join(process.cwd(), '../output');
    await fs.mkdir(outputDir, { recursive: true });
    
    const resultsPath = path.join(outputDir, 'latest-analysis.json');
    await fs.writeFile(resultsPath, JSON.stringify({ results, summary }, null, 2));
    
    return NextResponse.json({ results, summary });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to run analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Try to return latest analysis results
    const resultsPath = path.join(process.cwd(), '../output/latest-analysis.json');
    try {
      const data = await fs.readFile(resultsPath, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    } catch {
      // If no saved results, run analysis now
      const applications = await Database.getAllApplications();
      const results = analyzePortfolio(applications);
      const summary = generateSummary(results);
      
      // Save for next time
      const outputDir = path.join(process.cwd(), '../output');
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(resultsPath, JSON.stringify({ results, summary }, null, 2));
      
      return NextResponse.json({ results, summary });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to run analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
