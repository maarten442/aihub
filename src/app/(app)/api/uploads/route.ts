import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';

const ALLOWED_EXTENSIONS = new Set(['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'doc', 'docx']);
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

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

  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `File type not allowed. Accepted: ${[...ALLOWED_EXTENSIONS].join(', ')}` },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type' },
      { status: 400 }
    );
  }

  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('submissions')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('POST /api/uploads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  // Generate a signed URL (valid for 15 minutes)
  const { data: urlData } = await supabase.storage
    .from('submissions')
    .createSignedUrl(fileName, 900, {
      download: true,
    });

  return NextResponse.json({
    path: fileName,
    url: urlData?.signedUrl,
  }, { status: 201 });
}
