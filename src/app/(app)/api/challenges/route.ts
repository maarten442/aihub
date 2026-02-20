import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireModerator } from '@/lib/auth';
import { createChallengeSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  let user;
  try {
    user = await requireModerator();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createChallengeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const insertData = {
    ...parsed.data,
    video_url: parsed.data.video_url || null,
    status: 'active',
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from('challenges')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('POST /api/challenges error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
