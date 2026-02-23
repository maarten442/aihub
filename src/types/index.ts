export interface User {
  id: string;
  email: string;
  name: string;
  location_id: string | null;
  role: 'user' | 'moderator';
  avatar_url?: string;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  total_people: number;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  why_it_matters?: string;
  start_date: string;
  end_date: string;
  video_url?: string;
  status: 'draft' | 'active' | 'completed';
  created_by: string;
  created_at: string;
}

export interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  location_id: string;
  content: string;
  file_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  created_at: string;
  // Joined fields
  user?: User;
  challenge?: Challenge;
}

export interface Friction {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  impact_score?: number;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  submitted_by: string;
  created_at: string;
  // Joined fields
  user?: User;
}

export interface UseCaseStep {
  title: string;
  description: string;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  tools: string[];
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  steps: UseCaseStep[];
  image_url?: string;
  is_featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  created_at: string;
  // Joined fields
  user?: User;
}

export interface LeaderboardEntry {
  location: Location;
  submissions_count: number;
  participation_rate: number;
}
