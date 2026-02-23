'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';
import type { Friction } from '@/types';

interface Props {
  frictions: Friction[];
}

export function FrictionReviewList({ frictions }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [impactScores, setImpactScores] = useState<Record<string, number>>({});

  async function updateFriction(id: string, status: 'approved' | 'rejected', impactScore?: number) {
    setLoading(id);
    await fetch(`/api/frictions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, impact_score: impactScore }),
    });
    setLoading(null);
    router.refresh();
  }

  if (frictions.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">No pending frictions to review.</p>;
  }

  return (
    <div className="space-y-4">
      {frictions.map((friction) => (
        <div key={friction.id} className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium text-foreground">{friction.title}</h4>
            <div className="flex items-center gap-2">
              <Badge>{friction.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {friction.frequency}
              </span>
            </div>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{friction.description}</p>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Impact:</span>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                onClick={() => setImpactScores(prev => ({ ...prev, [friction.id]: n }))}
                className={`h-6 w-6 rounded text-xs font-medium transition-colors
                  ${(impactScores[friction.id] ?? 5) === n
                    ? 'bg-accent-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-accent-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => updateFriction(friction.id, 'approved', impactScores[friction.id] ?? 5)}
              disabled={loading === friction.id}
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => updateFriction(friction.id, 'rejected')}
              disabled={loading === friction.id}
            >
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
