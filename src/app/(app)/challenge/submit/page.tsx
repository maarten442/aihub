'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';

export default function SubmitHomeworkPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [challengeId] = useState('00000000-0000-0000-0000-000000000201');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const content = form.get('content') as string;

    let fileUrl: string | undefined;

    // Upload file first if present
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      const uploadRes = await fetch('/api/uploads', { method: 'POST', body: uploadForm });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        setErrors({ file: data.error || 'File upload failed' });
        setSubmitting(false);
        return;
      }

      const uploadData = await uploadRes.json();
      fileUrl = uploadData.path;
    }

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: challengeId,
        content,
        file_url: fileUrl,
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/missions" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Missions
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Submit Your Work</h1>
        <p className="text-muted-foreground">
          Share what you built or discovered for the current mission. Include a description and optionally attach a file.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Textarea
              id="content"
              name="content"
              label="What did you do?"
              placeholder="Describe your approach, the tools you used, and the result. Be specific!"
              required
              error={errors.content}
            />

            <FileUpload
              label="Attachment (optional)"
              onFileSelect={setFile}
              error={errors.file}
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
