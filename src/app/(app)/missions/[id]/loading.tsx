import { Card, CardContent } from '@/components/ui/card';

export default function MissionDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-36 rounded bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-14 rounded-full bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
        <div className="h-9 w-3/4 rounded bg-muted" />
      </div>

      <Card>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>

          {/* Why it matters box */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="h-4 w-28 rounded bg-muted-foreground/20" />
            <div className="h-4 w-full rounded bg-muted-foreground/20" />
            <div className="h-4 w-4/5 rounded bg-muted-foreground/20" />
          </div>

          {/* Video placeholder */}
          <div className="aspect-video w-full rounded-lg bg-muted" />

          <div className="h-4 w-40 rounded bg-muted" />

          <div className="pt-2">
            <div className="h-9 w-36 rounded-lg bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
