'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star } from 'lucide-react';
import type { UseCase } from '@/types';

const complexityBadge: Record<string, { label: string; variant: 'success' | 'info' | 'warning' }> = {
  beginner: { label: 'Beginner', variant: 'success' },
  intermediate: { label: 'Intermediate', variant: 'info' },
  advanced: { label: 'Advanced', variant: 'warning' },
};

interface Props {
  useCases: UseCase[];
}

export function UseCaseReviewList({ useCases }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateUseCase(id: string, body: { status?: string; is_featured?: boolean }) {
    setLoading(id);
    await fetch(`/api/use-cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setLoading(null);
    router.refresh();
  }

  if (useCases.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">No pending use cases to review.</p>;
  }

  return (
    <div className="space-y-4">
      {useCases.map((useCase) => {
        const badge = complexityBadge[useCase.complexity];
        return (
          <div key={useCase.id} className="rounded-lg border border-border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium text-foreground">{useCase.title}</h4>
              <div className="flex items-center gap-2">
                {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                <Badge>{useCase.category}</Badge>
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-1">
              {useCase.tools.map((tool) => (
                <Badge key={tool} variant="purple" className="text-[10px]">
                  {tool}
                </Badge>
              ))}
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{useCase.description}</p>
            {useCase.user && (
              <p className="mb-3 text-xs text-muted-foreground">Submitted by {useCase.user.name}</p>
            )}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => updateUseCase(useCase.id, { status: 'approved' })}
                disabled={loading === useCase.id}
              >
                <Check className="h-3.5 w-3.5" /> Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => updateUseCase(useCase.id, { status: 'rejected' })}
                disabled={loading === useCase.id}
              >
                <X className="h-3.5 w-3.5" /> Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateUseCase(useCase.id, { status: 'approved', is_featured: true })}
                disabled={loading === useCase.id}
              >
                <Star className="h-3.5 w-3.5" /> Feature
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
