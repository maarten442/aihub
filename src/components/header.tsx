import Link from 'next/link';
import { Sparkles, Trophy, AlertTriangle, Home, Settings, Lightbulb } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { RoleToggle } from './role-toggle';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/missions', label: 'Missions', icon: Sparkles },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/frictions', label: 'Wall of Friction', icon: AlertTriangle },
  { href: '/use-cases', label: 'Use Cases', icon: Lightbulb },
];

export async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">AI Hub</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {user.role === 'moderator' && (
              <Link
                href="/moderate"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-accent-600 transition-colors hover:bg-accent-50"
              >
                <Settings className="h-4 w-4" />
                Moderate
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <RoleToggle currentRole={user.role} />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
              {user.name.charAt(0)}
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:block">
              {user.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
