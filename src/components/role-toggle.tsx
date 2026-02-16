'use client';

import { Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoleToggleProps {
  currentRole: 'user' | 'moderator';
}

export function RoleToggle({ currentRole }: RoleToggleProps) {
  const router = useRouter();

  const toggle = () => {
    const newRole = currentRole === 'user' ? 'moderator' : 'user';
    document.cookie = `aihub_view_role=${newRole};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
      style={{
        borderColor: currentRole === 'moderator' ? '#c97d0e' : '#e3ddd4',
        backgroundColor: currentRole === 'moderator' ? '#fef9ee' : 'transparent',
        color: currentRole === 'moderator' ? '#c97d0e' : '#847669',
      }}
    >
      {currentRole === 'moderator' ? (
        <Shield className="h-3.5 w-3.5" />
      ) : (
        <User className="h-3.5 w-3.5" />
      )}
      {currentRole === 'moderator' ? 'Moderator' : 'User'}
    </button>
  );
}
