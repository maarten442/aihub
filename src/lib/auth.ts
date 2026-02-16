import { cookies } from 'next/headers';
import type { User } from '@/types';

const ROLE_COOKIE = 'aihub_view_role';

const MOCK_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@company.com',
  name: 'Demo User',
  location_id: '00000000-0000-0000-0000-000000000101',
  role: 'user',
  created_at: new Date().toISOString(),
};

export async function getUser(): Promise<User> {
  const cookieStore = await cookies();
  const roleCookie = cookieStore.get(ROLE_COOKIE);
  const role = roleCookie?.value === 'moderator' ? 'moderator' : 'user';

  return { ...MOCK_USER, role };
}

export async function requireModerator(): Promise<User> {
  const user = await getUser();
  if (user.role !== 'moderator') {
    throw new Error('Forbidden: moderator access required');
  }
  return user;
}
