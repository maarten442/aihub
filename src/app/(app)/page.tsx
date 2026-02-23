import Link from 'next/link';
import { Sparkles, Trophy, ArrowRight, Rocket, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { YouTubeEmbed } from '@/components/ui/youtube-embed';
import type { Challenge, LeaderboardEntry } from '@/types';

async function getActiveChallenge(): Promise<Challenge | null> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .lte('start_date', today)
    .gte('end_date', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data;
}

async function getLeaderboardPreview(): Promise<LeaderboardEntry[]> {
  const { data: locations } = await supabase.from('locations').select('*').order('name');
  const { data: submissions } = await supabase
    .from('submissions')
    .select('location_id')
    .eq('status', 'approved');

  const countsByLocation: Record<string, number> = {};
  for (const sub of submissions ?? []) {
    if (sub.location_id) countsByLocation[sub.location_id] = (countsByLocation[sub.location_id] || 0) + 1;
  }

  return (locations ?? [])
    .map((loc) => ({
      location: loc,
      submissions_count: countsByLocation[loc.id] || 0,
      participation_rate: loc.total_people > 0 ? Math.round(((countsByLocation[loc.id] || 0) / loc.total_people) * 100) : 0,
    }))
    .sort((a, b) => b.participation_rate - a.participation_rate)
    .slice(0, 3);
}

function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default async function HomePage() {
  const [challenge, leaderboard] = await Promise.all([
    getActiveChallenge(),
    getLeaderboardPreview(),
  ]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl gradient-hero px-8 py-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Rocket className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wider opacity-90">
              AI Adoption Platform
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            Level up your AI game,<br />one mission at a time
          </h1>
          <p className="mb-6 text-lg opacity-90">
            Complete monthly challenges, climb the leaderboard, and help surface
            the friction points where AI can make the biggest impact.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/missions">
              <Button size="lg" variant="accent">
                <Sparkles className="h-4 w-4" />
                View Missions
              </Button>
            </Link>
            <Link href="/frictions">
              <Button size="lg" variant="secondary">
                <AlertTriangle className="h-4 w-4" />
                Wall of Friction
              </Button>
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-accent-400/20 blur-3xl" />
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Active Mission */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Active Mission</h2>
            <Link href="/missions" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              All missions <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
          {challenge ? (
            <Card hover className="relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1 bg-primary-500" />
              <CardContent className="pl-5">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="purple">Active</Badge>
                  <span className="text-xs text-muted-foreground">
                    {daysRemaining(challenge.end_date)} days left
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {challenge.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {challenge.description}
                </p>
                {challenge.video_url && (
                  <div className="mb-4">
                    <YouTubeEmbed url={challenge.video_url} />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Link href={`/missions/${challenge.id}`}>
                    <Button size="sm">
                      Take on the Challenge <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href="/challenge/submit">
                    <Button size="sm" variant="secondary">
                      Submit your work <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Sparkles className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No active mission right now. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Leaderboard Preview */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Hub Leaderboard</h2>
            <Link href="/leaderboard" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Full rankings <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
          <Card>
            <CardContent className="space-y-4">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, i) => (
                  <div key={entry.location.id} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{entry.location.name}</span>
                        <span className="text-sm font-semibold text-primary-600">
                          {entry.participation_rate}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-primary-100">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${Math.min(entry.participation_rate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  <Trophy className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No submissions yet. Be the first!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
