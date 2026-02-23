import { Card, CardContent } from '@/components/ui/card';

export default function LeaderboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-40 rounded bg-muted" />
        <div className="h-4 w-96 rounded bg-muted" />
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted" />
              <div className="space-y-1.5">
                <div className="h-7 w-16 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Hub rankings */}
        <section className="lg:col-span-2 space-y-3">
          <div className="h-6 w-24 rounded bg-muted mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 rounded bg-muted" />
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-28 rounded bg-muted" />
                      <div className="h-5 w-12 rounded-full bg-muted" />
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Top contributors */}
        <section>
          <div className="h-6 w-36 rounded bg-muted mb-4" />
          <Card>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-muted" />
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="h-4 flex-1 rounded bg-muted" />
                  <div className="h-5 w-8 rounded-full bg-muted" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
