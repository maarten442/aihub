'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

const categories = [
  { value: 'Data & Reporting', label: 'Data & Reporting' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Meetings & Collaboration', label: 'Meetings & Collaboration' },
  { value: 'Document Processing', label: 'Document Processing' },
  { value: 'Customer Support', label: 'Customer Support' },
  { value: 'Development & IT', label: 'Development & IT' },
  { value: 'Other', label: 'Other' },
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function SubmitFrictionPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get('title'),
      description: form.get('description'),
      category: form.get('category'),
      frequency: form.get('frequency'),
    };

    const res = await fetch('/api/frictions', {
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

    router.push('/frictions');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/frictions" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Wall of Friction
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Report a Friction Point</h1>
        <p className="text-muted-foreground">
          Describe a recurring task or pain point where AI could help. Your submission will be reviewed by a moderator.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="title"
              name="title"
              label="Title"
              placeholder="e.g., Manual report generation takes hours"
              required
              error={errors.title}
            />
            <Textarea
              id="description"
              name="description"
              label="Description"
              placeholder="Describe the problem in detail. How often does it happen? How much time does it waste? How could AI help?"
              required
              error={errors.description}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                id="category"
                name="category"
                label="Category"
                options={categories}
                placeholder="Select a category"
                required
                error={errors.category}
              />
              <Select
                id="frequency"
                name="frequency"
                label="How often does this happen?"
                options={frequencies}
                placeholder="Select frequency"
                required
                error={errors.frequency}
              />
            </div>

            {errors.general && (
              <p className="text-sm text-red-600">{errors.general}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/frictions">
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
