import { Card, CardContent } from '@/components/ui/card';

export default function FrictionsSubmitLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
      </div>

      <Card>
        <CardContent className="space-y-5">
          {/* Title input */}
          <div className="space-y-1.5">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-10 w-full rounded-lg bg-muted" />
          </div>

          {/* Description textarea */}
          <div className="space-y-1.5">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-24 w-full rounded-lg bg-muted" />
          </div>

          {/* 2-col selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-lg bg-muted" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-lg bg-muted" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <div className="h-9 w-32 rounded-lg bg-muted" />
            <div className="h-9 w-20 rounded-lg bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
