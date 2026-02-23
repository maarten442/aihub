'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import type { Challenge, Location } from '@/types';

export default function SubmitHomeworkPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null | undefined>(undefined);

  useEffect(() => {
    fetch('/api/locations')
      .then((r) => r.json())
      .then(setLocations);

    fetch('/api/challenges/active')
      .then((r) => r.json())
      .then((data: Challenge[]) => setActiveChallenge(data?.[0] ?? null));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const content = form.get('content') as string;
    const locationId = form.get('location_id') as string;
    const miroUrl = (form.get('miro_url') as string)?.trim() || undefined;

    if (!locationId) {
      setErrors({ location_id: 'Please select a hub' });
      setSubmitting(false);
      return;
    }

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: activeChallenge!.id,
        location_id: locationId,
        content,
        file_url: miroUrl,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (Array.isArray(data.error)) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of data.error) {
          const path = issue.path?.[0] ?? 'general';
          fieldErrors[path] = issue.message;
        }
        setErrors(fieldErrors);
      } else {
        setErrors({ general: data.error || 'Something went wrong' });
      }
      setSubmitting(false);
      return;
    }

    router.push('/missions');
    router.refresh();
  }

  // Still loading
  if (activeChallenge === undefined) {
    return null;
  }

  // No active challenge — submissions closed
  if (!activeChallenge) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <Link href="/missions" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Missions
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Submissions Closed</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <XCircle className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              There is no active mission at the moment. Submissions are closed until a new mission starts.
            </p>
            <Link href="/missions">
              <Button variant="ghost">View Missions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/missions" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Missions
        </Link>
        <h1 className="mb-1 text-3xl font-bold text-foreground">Submit Your Work</h1>
        <p className="text-sm text-muted-foreground">For: {activeChallenge.title}</p>
        <p className="mt-2 text-muted-foreground">
          Build your solution on a Miro board, then describe it below and share the link.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              id="location_id"
              name="location_id"
              label="Hub"
              placeholder="Select your hub"
              required
              options={locations.map((l) => ({ value: l.id, label: l.name }))}
              defaultValue=""
              error={errors.location_id}
            />

            <Textarea
              id="content"
              name="content"
              label="Describe your solution"
              placeholder="Build your solution on a Miro board and describe what you made, how you built it, and what the result was. What AI tools did you use?"
              required
              error={errors.content}
            />

            <Input
              id="miro_url"
              name="miro_url"
              type="url"
              label="Miro Board Link (optional)"
              placeholder="https://miro.com/app/board/..."
              error={errors.miro_url}
            />

            {errors.general && (
              <p className="text-sm text-red-600">{errors.general}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/missions">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={submitting}>
                <Send className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
