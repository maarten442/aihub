import { Card, CardContent } from '@/components/ui/card';

export default function UseCasesSubmitLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-9 w-48 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
      </div>

      <Card>
        <CardContent className="space-y-5">
          {/* Title input */}
          <div className="space-y-1.5">
            <div className="h-4 w-10 rounded bg-muted" />
            <div className="h-10 w-full rounded-lg bg-muted" />
          </div>

          {/* Description textarea */}
          <div className="space-y-1.5">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-24 w-full rounded-lg bg-muted" />
          </div>

          {/* 2-col selects */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-lg bg-muted" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-lg bg-muted" />
            </div>
          </div>

          {/* Tool buttons */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-muted" />
              ))}
            </div>
            <div className="h-10 w-full rounded-lg bg-muted" />
          </div>

          {/* Workflow steps */}
          <div className="space-y-3">
            <div className="h-4 w-28 rounded bg-muted" />
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-10 w-full rounded-lg bg-muted" />
                  <div className="h-10 w-full rounded-lg bg-muted" />
                </div>
              </div>
            ))}
            <div className="h-8 w-24 rounded-lg bg-muted" />
          </div>

          {/* File upload */}
          <div className="space-y-1.5">
            <div className="h-4 w-44 rounded bg-muted" />
            <div className="h-20 w-full rounded-lg bg-muted" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <div className="h-9 w-20 rounded-lg bg-muted" />
            <div className="h-9 w-24 rounded-lg bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
