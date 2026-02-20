import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    await getUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all locations
  const { data: locations, error: locError } = await supabase
    .from('locations')
    .select('*')
    .order('name');

  if (locError) {
    console.error('GET /api/leaderboard locations error:', locError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  // Get submission counts grouped by submission location
  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select('location_id')
    .eq('status', 'approved');

  if (subError) {
    console.error('GET /api/leaderboard submissions error:', subError);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  // Count submissions per location
  const countsByLocation: Record<string, number> = {};
  for (const sub of submissions ?? []) {
    if (sub.location_id) {
      countsByLocation[sub.location_id] = (countsByLocation[sub.location_id] || 0) + 1;
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
