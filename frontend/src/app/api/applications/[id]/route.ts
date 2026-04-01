import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { ApplicationSchema } from '@/lib/types';
import { z } from 'zod';

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
    console.error(`GET /api/applications/${params.id} error:`, error);
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
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message === 'Application not found') {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    console.error(`PUT /api/applications/${params.id} error:`, error);
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
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Application not found') {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    console.error(`DELETE /api/applications/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
