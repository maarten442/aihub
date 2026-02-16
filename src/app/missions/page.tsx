import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Challenge } from '@/types';

async function getChallenges(): Promise<{ active: Challenge[]; past: Challenge[] }> {
  const { data } = await supabase
    .from('challenges')
    .select('*')
    .in('status', ['active', 'completed'])
    .order('start_date', { ascending: false });

  const today = new Date().toISOString().split('T')[0];
  const active = (data ?? []).filter((c) => c.status === 'active' && c.end_date >= today);
  const past = (data ?? []).filter((c) => c.status === 'completed' || c.end_date < today);

  return { active, past };
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}

function daysRemaining(endDate: string): number {
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export default async function MissionsPage() {
  const { active, past } = await getChallenges();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Missions</h1>
        <p className="text-muted-foreground">
          Monthly AI challenges to build skills and drive adoption across the organization.
        </p>
      </div>

      {/* Active Missions */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <Sparkles className="h-5 w-5 text-primary-500" />
          Active Missions
        </h2>
        {active.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((challenge) => (
              <Card key={challenge.id} hover className="relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-primary-500" />
                <CardContent className="pl-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="purple">Active</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {daysRemaining(challenge.end_date)} days left
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{challenge.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                    {challenge.description}
                  </p>
                  <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDateRange(challenge.start_date, challenge.end_date)}
                  </div>
                  <Link href="/challenge/submit">
                    <Button size="sm">
                      Submit your work <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Sparkles className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No active missions right now. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Past Missions */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Past Missions</h2>
          <div className="space-y-3">
            {past.map((challenge) => (
              <Card key={challenge.id} className="bg-muted/50">
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Badge>Completed</Badge>
                    </div>
                    <h3 className="font-medium text-foreground">{challenge.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDateRange(challenge.start_date, challenge.end_date)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
