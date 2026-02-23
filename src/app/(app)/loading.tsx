import { Card, CardContent } from '@/components/ui/card';

export default function HomeLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Hero */}
      <div className="rounded-2xl bg-muted px-8 py-12">
        <div className="max-w-2xl space-y-4">
          <div className="h-4 w-40 rounded bg-muted-foreground/20" />
          <div className="h-10 w-96 rounded bg-muted-foreground/20" />
          <div className="h-10 w-72 rounded bg-muted-foreground/20" />
          <div className="h-5 w-full max-w-lg rounded bg-muted-foreground/20" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-36 rounded-lg bg-muted-foreground/20" />
            <div className="h-10 w-40 rounded-lg bg-muted-foreground/20" />
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Active Mission */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-36 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
          <Card>
            <CardContent className="pl-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-14 rounded-full bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
              <div className="h-6 w-64 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              {/* Video placeholder 16:9 */}
              <div className="aspect-video w-full rounded-lg bg-muted" />
              <div className="flex gap-2">
                <div className="h-8 w-36 rounded-lg bg-muted" />
                <div className="h-8 w-36 rounded-lg bg-muted" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Leaderboard Preview */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-36 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
          <Card>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-28 rounded bg-muted" />
                      <div className="h-4 w-10 rounded bg-muted" />
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
