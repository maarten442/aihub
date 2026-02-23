'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export function CreateChallengeForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const videoUrl = (form.get('video_url') as string)?.trim();
    const whyItMatters = (form.get('why_it_matters') as string)?.trim();
    const body = {
      title: form.get('title'),
      description: form.get('description'),
      why_it_matters: whyItMatters || undefined,
      start_date: form.get('start_date'),
      end_date: form.get('end_date'),
      video_url: videoUrl || undefined,
    };

    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

    setSuccess(true);
    setSubmitting(false);
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="challenge-title"
          name="title"
          label="Title"
          placeholder="e.g., AI Prompt Engineering 101"
          required
          error={errors.title}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="start_date"
            name="start_date"
            label="Start Date"
            type="date"
            required
            error={errors.start_date}
          />
          <Input
            id="end_date"
            name="end_date"
            label="End Date"
            type="date"
            required
            error={errors.end_date}
          />
        </div>
      </div>
      <Textarea
        id="challenge-description"
        name="description"
        label="Description"
        placeholder="Describe the challenge, what participants should do, and any bonus criteria."
        required
        error={errors.description}
      />
      <Textarea
        id="why_it_matters"
        name="why_it_matters"
        label="Why it matters (optional)"
        placeholder="Explain the business impact or personal benefit of completing this mission."
        error={errors.why_it_matters}
      />
      <Input
        id="video_url"
        name="video_url"
        label="YouTube Video (optional)"
        placeholder="https://www.youtube.com/watch?v=..."
        error={errors.video_url}
      />
      {errors.general && <p className="text-sm text-red-600">{errors.general}</p>}
      {success && <p className="text-sm text-emerald-600">Challenge created successfully!</p>}
      <Button type="submit" disabled={submitting}>
        <Send className="h-4 w-4" />
        {submitting ? 'Creating...' : 'Create Challenge'}
      </Button>
    </form>
  );
}
