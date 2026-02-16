import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, FileText, AlertTriangle, MapPin, Sparkles } from 'lucide-react';
import { CreateChallengeForm } from './create-challenge-form';
import { FrictionReviewList } from './friction-review-list';
import { SubmissionsList } from './submissions-list';
import { LocationManager } from './location-manager';

async function getData() {
  const [
    { data: pendingFrictions },
    { data: pendingSubmissions },
    { data: challenges },
    { data: locations },
  ] = await Promise.all([
    supabase.from('frictions').select('*, user:users(*)').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('submissions').select('*, user:users(*), challenge:challenges(*)').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('challenges').select('*').order('created_at', { ascending: false }),
    supabase.from('locations').select('*').order('name'),
  ]);

  return {
    pendingFrictions: pendingFrictions ?? [],
    pendingSubmissions: pendingSubmissions ?? [],
    challenges: challenges ?? [],
    locations: locations ?? [],
  };
}

export default async function ModeratePage() {
  const user = await getUser();
  if (user.role !== 'moderator') redirect('/');

  const { pendingFrictions, pendingSubmissions, challenges, locations } = await getData();

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Settings className="h-6 w-6 text-accent-600" />
          <h1 className="text-3xl font-bold text-foreground">Moderator Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage challenges, review submissions and friction points, and configure locations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingFrictions.length}</p>
              <p className="text-xs text-muted-foreground">Pending Frictions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
              <p className="text-xs text-muted-foreground">Pending Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-100 p-2">
              <Sparkles className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{challenges.length}</p>
              <p className="text-xs text-muted-foreground">Total Challenges</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{locations.length}</p>
              <p className="text-xs text-muted-foreground">Locations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Challenge */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              Create New Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateChallengeForm />
          </CardContent>
        </Card>
      </section>

      {/* Pending Frictions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Pending Frictions
              {pendingFrictions.length > 0 && (
                <Badge variant="warning">{pendingFrictions.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FrictionReviewList frictions={pendingFrictions} />
          </CardContent>
        </Card>
      </section>

      {/* Pending Submissions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Pending Submissions
              {pendingSubmissions.length > 0 && (
                <Badge variant="info">{pendingSubmissions.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubmissionsList submissions={pendingSubmissions} />
          </CardContent>
        </Card>
      </section>

      {/* Location Manager */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              Manage Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LocationManager locations={locations} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
