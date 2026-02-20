import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireModerator } from '@/lib/auth';

export async function GET() {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('frictions')
    .select('*, user:users(id, name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api/frictions/pending error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data);
}
