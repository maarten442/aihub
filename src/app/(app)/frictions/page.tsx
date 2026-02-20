import Link from 'next/link';
import { AlertTriangle, ThumbsUp, Plus, Clock, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Friction } from '@/types';

async function getFrictions(): Promise<Friction[]> {
  const { data } = await supabase
    .from('frictions')
    .select('*, user:users(*)')
    .in('status', ['approved', 'resolved'])
    .order('votes', { ascending: false });
  return (data ?? []) as Friction[];
}

const statusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'default' }> = {
  approved: { label: 'Open', variant: 'warning' },
  resolved: { label: 'Resolved', variant: 'success' },
};

const frequencyLabel: Record<string, string> = {
  daily: 'Happens daily',
  weekly: 'Happens weekly',
  monthly: 'Happens monthly',
};

export default async function FrictionsPage() {
  const frictions = await getFrictions();
  const categories = [...new Set(frictions.map((f) => f.category))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Wall of Friction</h1>
          <p className="text-muted-foreground">
            Surface the recurring pain points where AI could save time. Vote to prioritize.
          </p>
        </div>
        <Link href="/frictions/submit">
          <Button>
            <Plus className="h-4 w-4" />
            Report Friction
          </Button>
        </Link>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat} variant="purple" className="cursor-default">
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Frictions Grid */}
      {frictions.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {frictions.map((friction) => {
            const badge = statusBadge[friction.status] ?? { label: friction.status, variant: 'default' as const };
            return (
              <Card key={friction.id} hover className="flex flex-col">
                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    {friction.impact_score && (
                      <span className="flex items-center gap-1 text-xs font-medium text-accent-600">
                        <Zap className="h-3 w-3" /> Impact: {friction.impact_score}/10
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{friction.title}</h3>
                  <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-3">
                    {friction.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {friction.votes} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {frequencyLabel[friction.frequency]}
                      </span>
                    </div>
                    <Badge>{friction.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <AlertTriangle className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p className="mb-4 text-lg font-medium">No friction points yet</p>
            <p className="mb-6">Be the first to report a recurring problem that AI could solve.</p>
            <Link href="/frictions/submit">
              <Button>
                <Plus className="h-4 w-4" /> Report Friction
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
