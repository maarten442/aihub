import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireModerator } from '@/lib/auth';
import { updateSubmissionSchema } from '@/lib/validations';
import { z } from 'zod/v4';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireModerator();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('submissions')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('PUT /api/submissions/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}
