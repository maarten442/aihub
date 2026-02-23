import { Card, CardContent } from '@/components/ui/card';

export default function UseCasesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 rounded bg-muted" />
          <div className="h-4 w-80 rounded bg-muted" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>

      {/* Featured card */}
      <Card className="border-2 border-muted">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
          <div className="h-7 w-64 rounded bg-muted" />
          <div className="space-y-1.5">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-5 w-24 rounded-full bg-muted" />
            <div className="h-5 w-16 rounded-full bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-muted" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-muted shrink-0" />
                <div className="h-4 flex-1 rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category badges */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-5 w-20 rounded-full bg-muted" />
        ))}
      </div>

      {/* Use cases grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded-full bg-muted" />
              </div>
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="space-y-1.5">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
              <div className="flex flex-wrap gap-1">
                <div className="h-4 w-14 rounded-full bg-muted" />
                <div className="h-4 w-16 rounded-full bg-muted" />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
