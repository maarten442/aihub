import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabase as serviceClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const response = NextResponse.redirect(`${origin}/`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Server-side domain enforcement
  const allowedEmails = ['maartenrottier@gmail.com'];
  if (!data.user.email.endsWith('@miro.com') && !allowedEmails.includes(data.user.email.toLowerCase())) {
    const domain = data.user.email.split('@')[1];
    console.warn(`Auth rejected: non-miro.com domain "${domain}" at ${new Date().toISOString()}`);
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login`);
  }

  // Upsert user row (insert if not exists, don't overwrite name/role/location)
  const email = data.user.email;
  const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const { data: existingUser } = await serviceClient
    .from('users')
    .select('id')
    .eq('id', data.user.id)
    .single();

  if (!existingUser) {
    await serviceClient.from('users').insert({
      id: data.user.id,
      email,
      name,
      role: 'user',
    });
  }

  return response;
}
