import { Card, CardContent } from '@/components/ui/card';

export default function UpdatesLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-32 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
      </div>
      <Card>
        <CardContent className="py-16 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="h-6 w-28 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}
