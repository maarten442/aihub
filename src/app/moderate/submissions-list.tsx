'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { Submission } from '@/types';

interface Props {
  submissions: Submission[];
}

export function SubmissionsList({ submissions }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateSubmission(id: string, status: 'approved' | 'rejected') {
    setLoading(id);
    await fetch(`/api/submissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  }

  if (submissions.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">No pending submissions to review.</p>;
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => (
        <div key={sub.id} className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                {sub.user?.name?.charAt(0) ?? '?'}
              </div>
              <span className="text-sm font-medium text-foreground">{sub.user?.name ?? 'Unknown'}</span>
            </div>
            <Badge variant="info">{sub.challenge?.title ?? 'Unknown challenge'}</Badge>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{sub.content}</p>
          {sub.file_url && (
            <p className="mb-3 text-xs text-primary-600">Attachment: {sub.file_url}</p>
          )}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => updateSubmission(sub.id, 'approved')}
              disabled={loading === sub.id}
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => updateSubmission(sub.id, 'rejected')}
              disabled={loading === sub.id}
            >
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
