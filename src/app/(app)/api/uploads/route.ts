import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getUser();

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('submissions')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate a signed URL (valid for 1 hour)
  const { data: urlData } = await supabase.storage
    .from('submissions')
    .createSignedUrl(fileName, 3600);

  return NextResponse.json({
    path: fileName,
    url: urlData?.signedUrl,
  }, { status: 201 });
}
