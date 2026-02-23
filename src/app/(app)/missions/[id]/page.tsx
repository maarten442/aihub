import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ArrowRight, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { YouTubeEmbed } from '@/components/ui/youtube-embed';
import { MarkdownContent } from '@/components/ui/markdown-content';
import type { Challenge } from '@/types';

async function getChallenge(id: string): Promise<Challenge | null> {
  const { data } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single();
  return data ?? null;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}

function daysRemaining(endDate: string): number {
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export default async function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = await getChallenge(id);

  if (!challenge) notFound();

  const today = new Date().toISOString().split('T')[0];
  const isActive = challenge.status === 'active' && challenge.end_date >= today;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/missions" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Missions
        </Link>
        <div className="mb-3 flex items-center gap-2">
          {isActive ? (
            <>
              <Badge variant="purple">Active</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {daysRemaining(challenge.end_date)} days left
              </span>
            </>
          ) : (
            <Badge>Completed</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-foreground">{challenge.title}</h1>
      </div>

      <Card>
        <CardContent className="space-y-5">
          <MarkdownContent className="text-muted-foreground leading-relaxed">{challenge.description}</MarkdownContent>

          {challenge.why_it_matters && (
            <div className="rounded-lg bg-primary-50 border border-primary-100 p-4">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-700">
                <Lightbulb className="h-4 w-4" />
                Why it matters
              </h2>
              <MarkdownContent className="text-sm text-primary-800 leading-relaxed">{challenge.why_it_matters}</MarkdownContent>
            </div>
          )}

          {challenge.video_url && (
            <YouTubeEmbed url={challenge.video_url} />
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDateRange(challenge.start_date, challenge.end_date)}
          </div>

          {isActive && (
            <div className="pt-2">
              <Link href="/challenge/submit">
                <Button>
                  Join the mission <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
