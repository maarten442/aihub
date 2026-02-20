import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    await getUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .lte('start_date', today)
    .gte('end_date', today)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api/challenges/active error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data);
}
