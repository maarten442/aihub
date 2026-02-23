import { Card, CardContent } from '@/components/ui/card';

export default function MissionsLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-32 rounded bg-muted" />
        <div className="h-4 w-96 rounded bg-muted" />
      </div>

      {/* Active Missions */}
      <section>
        <div className="h-6 w-36 rounded bg-muted mb-4" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="pl-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-14 rounded-full bg-muted" />
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="h-6 w-3/4 rounded bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-8 w-40 rounded-lg bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Past Missions */}
      <section>
        <div className="h-6 w-28 rounded bg-muted mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-muted/50">
              <CardContent className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-20 rounded-full bg-muted" />
                  <div className="h-5 w-56 rounded bg-muted" />
                  <div className="h-4 w-32 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
