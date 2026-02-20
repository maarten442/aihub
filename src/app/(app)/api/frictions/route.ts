import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import { createFrictionSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'votes';

  let query = supabase
    .from('frictions')
    .select('*, user:users(*)');

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category', category);

  if (sort === 'votes') {
    query = query.order('votes', { ascending: false });
  } else if (sort === 'recent') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'impact') {
    query = query.order('impact_score', { ascending: false, nullsFirst: false });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  const body = await request.json();
  const parsed = createFrictionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('frictions')
    .insert({ ...parsed.data, submitted_by: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
