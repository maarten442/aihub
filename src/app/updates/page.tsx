import { Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function UpdatesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Updates</h1>
        <p className="text-muted-foreground">
          Stay in the loop on AI Hub news and platform changes.
        </p>
      </div>
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <Bell className="mx-auto mb-4 h-12 w-12 opacity-40" />
          <p className="text-lg font-medium">Coming soon</p>
          <p className="mt-2">We&apos;re working on bringing you platform updates and announcements.</p>
        </CardContent>
      </Card>
    </div>
  );
}
