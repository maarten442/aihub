import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Trophy, AlertTriangle, Home, Settings, Lightbulb, LogOut } from 'lucide-react';
import { getUser } from '@/lib/auth';

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
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/miroai2.png" alt="Miro AI Hub" width={32} height={32} className="rounded-lg" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-foreground">Miro</span>
              <span className="text-lg font-semibold text-primary-600">AI Hub</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary-50 hover:text-primary-600 [&:hover_svg]:text-primary-500"
              >
                <Icon className="h-4 w-4 text-muted-foreground transition-colors" />
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
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
              {user.name.charAt(0)}
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:block">
              {user.name}
            </span>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
