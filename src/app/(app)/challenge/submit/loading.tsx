import { Card, CardContent } from '@/components/ui/card';

export default function ChallengeSubmitLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-9 w-48 rounded bg-muted" />
        <div className="h-4 w-56 rounded bg-muted" />
        <div className="h-4 w-80 rounded bg-muted" />
      </div>

      <Card>
        <CardContent className="space-y-5">
          {/* Hub select */}
          <div className="space-y-1.5">
            <div className="h-4 w-10 rounded bg-muted" />
            <div className="h-10 w-full rounded-lg bg-muted" />
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="h-24 w-full rounded-lg bg-muted" />
          </div>

          {/* URL input */}
          <div className="space-y-1.5">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-10 w-full rounded-lg bg-muted" />
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
