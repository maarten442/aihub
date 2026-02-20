import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import { createSubmissionSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    await getUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get('challenge_id');

  let query = supabase
    .from('submissions')
    .select('*, user:users(id, name), challenge:challenges(*)')
    .order('created_at', { ascending: false });

  if (challengeId) {
    query = query.eq('challenge_id', challengeId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('GET /api/submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  let user;
  try {
    user = await getUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  // Check if challenge has ended
  const { data: challenge } = await supabase
    .from('challenges')
    .select('end_date')
    .eq('id', parsed.data.challenge_id)
    .single();

  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  if (challenge.end_date < today) {
    return NextResponse.json({ error: 'This challenge has ended and is no longer accepting submissions' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You already submitted for this challenge' },
        { status: 409 }
      );
    }
    console.error('POST /api/submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
