import { createSupabaseServer } from './supabase-server';
import { supabase as serviceClient } from './supabase';
import type { User } from '@/types';

export async function getUser(): Promise<User> {
  const supabase = await createSupabaseServer();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email) {
    throw new Error('Not authenticated');
  }

  const { data: dbUser } = await serviceClient
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!dbUser) {
    throw new Error('User not found in database');
  }

  return dbUser as User;
}

export async function requireModerator(): Promise<User> {
  const user = await getUser();
  if (user.role !== 'moderator') {
    throw new Error('Forbidden: moderator access required');
  }
  return user;
}
