import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { ApplicationSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET() {
  try {
    const applications = await Database.getAllApplications();
    return NextResponse.json(applications);
  } catch (error) {
    console.error('GET /api/applications error:', error);
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
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('POST /api/applications error:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
