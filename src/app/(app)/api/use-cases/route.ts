import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import { createUseCaseSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    await getUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'approved';
  const category = searchParams.get('category');
  const tool = searchParams.get('tool');
  const sort = searchParams.get('sort') || 'recent';

  let query = supabase
    .from('use_cases')
    .select('*, user:users(id, name)');

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category', category);
  if (tool) query = query.contains('tools', [tool]);

  if (sort === 'title') {
    query = query.order('title', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error('GET /api/use-cases error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  const body = await request.json();
  const parsed = createUseCaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('use_cases')
    .insert({ ...parsed.data, submitted_by: user.id })
    .select()
    .single();

  if (error) {
    console.error('POST /api/use-cases error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
