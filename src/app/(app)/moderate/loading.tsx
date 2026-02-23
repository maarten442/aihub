import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ModerateLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-muted" />
          <div className="h-9 w-48 rounded bg-muted" />
        </div>
        <div className="h-4 w-96 rounded bg-muted" />
      </div>

      {/* Stats grid — 5 cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted" />
              <div className="space-y-1">
                <div className="h-7 w-8 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section cards */}
      {[1, 2, 3, 4, 5].map((i) => (
        <section key={i}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-muted" />
                <div className="h-5 w-40 rounded bg-muted" />
                <div className="h-5 w-8 rounded-full bg-muted" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-16 w-full rounded-lg bg-muted" />
              ))}
            </CardContent>
          </Card>
        </section>
      ))}
    </div>
  );
}
