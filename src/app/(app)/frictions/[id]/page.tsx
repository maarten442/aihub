import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Friction } from '@/types';

async function getFriction(id: string): Promise<Friction | null> {
  const { data } = await supabase
    .from('frictions')
    .select('*, user:users(id, name)')
    .eq('id', id)
    .single();
  return data ?? null;
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

export default async function FrictionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const friction = await getFriction(id);

  if (!friction) notFound();

  const badge = statusBadge[friction.status] ?? { label: friction.status, variant: 'default' as const };
  const submittedDate = new Date(friction.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/frictions" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Wall of Friction
        </Link>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant={badge.variant}>{badge.label}</Badge>
          {friction.impact_score && (
            <span className="flex items-center gap-1 text-xs font-medium text-accent-600">
              <Zap className="h-3 w-3" /> Impact: {friction.impact_score}/10
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-foreground">{friction.title}</h1>
      </div>

      <Card>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground leading-relaxed">{friction.description}</p>

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
            <Badge>{friction.category}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {frequencyLabel[friction.frequency]}
            </span>
          </div>

          <div className="border-t border-border pt-4 text-xs text-muted-foreground">
            Submitted by <span className="font-medium text-foreground">{friction.user?.name ?? 'Unknown'}</span> on {submittedDate}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
