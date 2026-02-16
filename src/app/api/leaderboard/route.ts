import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Get all locations
  const { data: locations, error: locError } = await supabase
    .from('locations')
    .select('*')
    .order('name');

  if (locError) return NextResponse.json({ error: locError.message }, { status: 500 });

  // Get submission counts grouped by user location
  // We join submissions -> users -> locations to count per location
  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select('user:users(location_id)')
    .eq('status', 'approved');

  if (subError) return NextResponse.json({ error: subError.message }, { status: 500 });

  // Count submissions per location
  const countsByLocation: Record<string, number> = {};
  for (const sub of submissions ?? []) {
    const locationId = (sub.user as unknown as { location_id: string })?.location_id;
    if (locationId) {
      countsByLocation[locationId] = (countsByLocation[locationId] || 0) + 1;
    }
  }

  // Calculate participation rate
  const leaderboard = (locations ?? []).map((loc) => {
    const count = countsByLocation[loc.id] || 0;
    return {
      location: loc,
      submissions_count: count,
      participation_rate: loc.total_people > 0 ? Math.round((count / loc.total_people) * 100) : 0,
    };
  });

  // Sort by participation rate descending
  leaderboard.sort((a, b) => b.participation_rate - a.participation_rate);

  return NextResponse.json(leaderboard);
}
