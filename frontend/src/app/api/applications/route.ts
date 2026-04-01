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
    
    // Create application with defaults for optional fields
    const appData = {
      ...body,
      'Prod URL': body['Prod URL'] || '',
      'Dev URL': body['Dev URL'] || '',
      'Test URL': body['Test URL'] || '',
      'Any Additional url': '',
      'Requires Login?': 'Unknown',
      'Type of Login': '',
      'Akamai?': 'Unknown',
      'Project Manager': '',
      'Development Team': '',
      'Development Org': 'Unknown',
      'Hosting Org': 'Unknown',
      'Hosting Cost': '',
      'Funding Notes': '',
      Notes: '',
    };
    
    // Validate with Zod (will add defaults)
    const validated = ApplicationSchema.parse(appData);
    
    // Save to database
    const created = await Database.createApplication(validated);
    
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
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
