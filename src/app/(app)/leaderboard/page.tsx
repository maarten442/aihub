import { Trophy, MapPin, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LeaderboardEntry } from '@/types';

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data: locations } = await supabase.from('locations').select('*').order('name');
  const { data: submissions } = await supabase
    .from('submissions')
    .select('user:users(location_id)')
    .eq('status', 'approved');

  const countsByLocation: Record<string, number> = {};
  for (const sub of submissions ?? []) {
    const locationId = (sub.user as unknown as { location_id: string })?.location_id;
    if (locationId) countsByLocation[locationId] = (countsByLocation[locationId] || 0) + 1;
  }

  return (locations ?? [])
    .map((loc) => ({
      location: loc,
      submissions_count: countsByLocation[loc.id] || 0,
      participation_rate: loc.total_people > 0 ? Math.round(((countsByLocation[loc.id] || 0) / loc.total_people) * 100) : 0,
    }))
    .sort((a, b) => b.participation_rate - a.participation_rate);
}

async function getTopContributors() {
  const { data } = await supabase
    .from('submissions')
    .select('user_id, user:users(name, location_id)')
    .eq('status', 'approved');

  const counts: Record<string, { name: string; count: number }> = {};
  for (const sub of data ?? []) {
    const user = sub.user as unknown as { name: string; location_id: string };
    if (user) {
      if (!counts[sub.user_id]) counts[sub.user_id] = { name: user.name, count: 0 };
      counts[sub.user_id].count++;
    }
  }

  return Object.entries(counts)
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

export default async function LeaderboardPage() {
  const [leaderboard, topContributors] = await Promise.all([
    getLeaderboard(),
    getTopContributors(),
  ]);

  const totalSubmissions = leaderboard.reduce((sum, e) => sum + e.submissions_count, 0);
  const totalPeople = leaderboard.reduce((sum, e) => sum + e.location.total_people, 0);
  const overallRate = totalPeople > 0 ? Math.round((totalSubmissions / totalPeople) * 100) : 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how each hub is performing. Rankings based on participation rate (submissions / total people).
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-100 p-2.5">
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overallRate}%</p>
              <p className="text-sm text-muted-foreground">Overall Participation</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-100 p-2.5">
              <Trophy className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalSubmissions}</p>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2.5">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{leaderboard.length}</p>
              <p className="text-sm text-muted-foreground">Active Hubs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Hub Rankings */}
        <section className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
            <MapPin className="h-5 w-5 text-primary-500" />
            All Hubs
          </h2>
          <div className="space-y-3">
            {leaderboard.map((entry, i) => (
              <Card key={entry.location.id} hover>
                <CardContent className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    i < 3
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {i < 3 ? (
                      <Trophy className={`h-5 w-5 ${medalColors[i]}`} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {entry.location.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {entry.submissions_count} / {entry.location.total_people} people
                        </span>
                        <Badge variant={entry.participation_rate >= 50 ? 'success' : entry.participation_rate >= 20 ? 'warning' : 'default'}>
                          {entry.participation_rate}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
                        style={{ width: `${Math.min(entry.participation_rate, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Contributors */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
            <Trophy className="h-5 w-5 text-accent-500" />
            Top Contributors
          </h2>
          <Card>
            <CardContent>
              {topContributors.length > 0 ? (
                <div className="space-y-3">
                  {topContributors.map((contributor, i) => (
                    <div key={contributor.id} className="flex items-center gap-3">
                      <span className="w-5 text-center text-sm font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                        {contributor.name.charAt(0)}
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {contributor.name}
                      </span>
                      <Badge variant="purple">{contributor.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No submissions yet. Be the first!
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
