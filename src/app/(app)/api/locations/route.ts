import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser, requireModerator } from '@/lib/auth';
import { createLocationSchema } from '@/lib/validations';

export async function GET() {
  try {
    await getUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name');

  if (error) {
    console.error('GET /api/locations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createLocationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('locations')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    console.error('POST /api/locations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
