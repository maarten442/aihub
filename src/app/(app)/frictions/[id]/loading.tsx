import { Card, CardContent } from '@/components/ui/card';

export default function FrictionDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
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

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
            <div className="h-5 w-16 rounded-full bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>

          <div className="border-t border-border pt-4">
            <div className="h-4 w-56 rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
