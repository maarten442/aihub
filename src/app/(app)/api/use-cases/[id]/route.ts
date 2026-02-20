import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireModerator } from '@/lib/auth';
import { updateUseCaseSchema } from '@/lib/validations';
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
  const parsed = updateUseCaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  // Use atomic DB function for featured toggle to prevent race conditions
  if (parsed.data.is_featured) {
    const { error: rpcError } = await supabase.rpc('set_featured_use_case', {
      target_id: id,
    });
    if (rpcError) {
      console.error('PUT /api/use-cases/[id] featured toggle error:', rpcError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  // Apply any other updates (status, or is_featured=false)
  if (parsed.data.status || parsed.data.is_featured === false) {
    const updateData: Record<string, unknown> = {};
    if (parsed.data.status) updateData.status = parsed.data.status;
    if (parsed.data.is_featured === false) updateData.is_featured = false;

    const { error } = await supabase
      .from('use_cases')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('PUT /api/use-cases/[id] error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  // Fetch and return the updated record
  const { data, error } = await supabase
    .from('use_cases')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('PUT /api/use-cases/[id] fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}
