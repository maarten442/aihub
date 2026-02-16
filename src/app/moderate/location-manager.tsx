'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MapPin } from 'lucide-react';
import type { Location } from '@/types';

interface Props {
  locations: Location[];
}

export function LocationManager({ locations }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name'),
      total_people: Number(form.get('total_people')),
    };

    const res = await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to add location');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setAdding(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => (
          <div key={loc.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
            <MapPin className="h-4 w-4 text-primary-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{loc.name}</p>
              <p className="text-xs text-muted-foreground">{loc.total_people} people</p>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="flex items-end gap-3">
          <Input
            id="loc-name"
            name="name"
            label="Location Name"
            placeholder="e.g., Berlin"
            required
          />
          <Input
            id="loc-people"
            name="total_people"
            label="Total People"
            type="number"
            min={1}
            placeholder="e.g., 30"
            required
          />
          <Button type="submit" disabled={submitting} size="sm">
            {submitting ? 'Adding...' : 'Add'}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Add Location
        </Button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
