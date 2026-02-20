-- AI Hub Database Schema
-- Run this in the Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  total_people INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location_id UUID REFERENCES locations(id),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenges (missions) table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  content TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Frictions table
CREATE TABLE frictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
  submitted_by UUID NOT NULL REFERENCES users(id),
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_location ON submissions(location_id);
CREATE INDEX idx_frictions_status ON frictions(status);
CREATE INDEX idx_frictions_submitted_by ON frictions(submitted_by);
CREATE INDEX idx_users_location ON users(location_id);

-- Seed data: Locations
INSERT INTO locations (id, name, total_people) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Amsterdam', 65),
  ('00000000-0000-0000-0000-000000000102', 'London', 50),
  ('00000000-0000-0000-0000-000000000103', 'San Francisco', 40),
  ('00000000-0000-0000-0000-000000000104', 'Tokyo', 25),
  ('00000000-0000-0000-0000-000000000105', 'Sydney', 20);

-- Seed data: Test user
INSERT INTO users (id, email, name, location_id, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@company.com', 'Demo User', '00000000-0000-0000-0000-000000000101', 'user');

-- Seed data: Example challenge
INSERT INTO challenges (id, title, description, start_date, end_date, status, created_by) VALUES
  ('00000000-0000-0000-0000-000000000201',
   'AI Prompt Engineering 101',
   'Write a prompt that helps you automate a repetitive task in your daily workflow. Share the prompt, the tool you used, and a screenshot of the result. Bonus points for creative solutions!',
   '2026-02-01',
   '2026-02-28',
   'active',
   '00000000-0000-0000-0000-000000000001');

-- Use Cases table
CREATE TABLE use_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tools TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  complexity TEXT NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced')),
  steps JSONB NOT NULL DEFAULT '[]',
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_use_cases_status ON use_cases(status);
CREATE INDEX idx_use_cases_category ON use_cases(category);
CREATE INDEX idx_use_cases_submitted_by ON use_cases(submitted_by);
CREATE INDEX idx_use_cases_is_featured ON use_cases(is_featured);
CREATE INDEX idx_use_cases_tools ON use_cases USING GIN(tools);

-- ============================================================
-- Row Level Security (RLS)
-- The app uses a service role key which bypasses RLS, but
-- enabling RLS provides defense-in-depth if the key is leaked.
-- ============================================================

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE frictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all locations
CREATE POLICY "Authenticated users can read locations"
  ON locations FOR SELECT TO authenticated USING (true);

-- Authenticated users can read all user profiles
CREATE POLICY "Authenticated users can read users"
  ON users FOR SELECT TO authenticated USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Authenticated users can read all challenges
CREATE POLICY "Authenticated users can read challenges"
  ON challenges FOR SELECT TO authenticated USING (true);

-- Authenticated users can read all submissions
CREATE POLICY "Authenticated users can read submissions"
  ON submissions FOR SELECT TO authenticated USING (true);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Authenticated users can read all frictions
CREATE POLICY "Authenticated users can read frictions"
  ON frictions FOR SELECT TO authenticated USING (true);

-- Users can insert their own frictions
CREATE POLICY "Users can insert own frictions"
  ON frictions FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);

-- Authenticated users can read all use cases
CREATE POLICY "Authenticated users can read use_cases"
  ON use_cases FOR SELECT TO authenticated USING (true);

-- Users can insert their own use cases
CREATE POLICY "Users can insert own use_cases"
  ON use_cases FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);

-- ============================================================
-- Atomic featured use case toggle (prevents race condition)
-- ============================================================

CREATE OR REPLACE FUNCTION set_featured_use_case(target_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Unset all featured flags and set the target in one transaction
  UPDATE use_cases SET is_featured = false WHERE is_featured = true AND id != target_id;
  UPDATE use_cases SET is_featured = true WHERE id = target_id;
END;
$$;

-- Seed data: Example frictions
INSERT INTO frictions (title, description, category, frequency, status, submitted_by, votes) VALUES
  ('Manual report generation takes hours', 'Every Monday I spend 3 hours copying data from multiple sources into a weekly report. This could be automated with AI.', 'Data & Reporting', 'weekly', 'approved', '00000000-0000-0000-0000-000000000001', 12),
  ('Translating customer emails manually', 'We get customer emails in 5+ languages and manually translate them before routing. An AI translation layer would save significant time.', 'Communication', 'daily', 'approved', '00000000-0000-0000-0000-000000000001', 8),
  ('No consistent meeting summaries', 'Meeting notes are inconsistent or missing entirely. AI transcription and summarization would help.', 'Meetings & Collaboration', 'daily', 'pending', '00000000-0000-0000-0000-000000000001', 5);

-- Seed data: Example use cases
INSERT INTO use_cases (id, title, description, tools, category, complexity, steps, is_featured, status, submitted_by) VALUES
  ('00000000-0000-0000-0000-000000000301',
   'Automated Weekly Report Generation',
   'Replaced a 3-hour manual reporting process with an AI-powered pipeline that pulls data from multiple sources, generates summaries, and formats everything into a polished report.',
   '{"Claude Code","ChatGPT"}',
   'Data & Reporting',
   'intermediate',
   '[{"title":"Set up data sources","description":"Connected our CRM, analytics, and project management tools via APIs"},{"title":"Create the prompt template","description":"Designed a structured prompt that takes raw data and outputs a formatted report"},{"title":"Automate the pipeline","description":"Used Claude Code to build a script that runs every Monday morning and emails the report"}]',
   true,
   'approved',
   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000302',
   'AI-Powered Code Review Assistant',
   'Set up an AI code review bot that catches common issues, suggests improvements, and ensures coding standards before human review.',
   '{"Copilot","Claude Code"}',
   'Development',
   'advanced',
   '[{"title":"Define review criteria","description":"Listed our coding standards and common anti-patterns to check for"},{"title":"Integrate with CI/CD","description":"Added an AI review step to our pull request pipeline"},{"title":"Fine-tune feedback","description":"Iterated on the prompt to reduce false positives and improve suggestions"}]',
   false,
   'approved',
   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000303',
   'Customer Email Auto-Categorization',
   'Using AI to automatically categorize and prioritize incoming customer emails, routing them to the right team.',
   '{"ChatGPT"}',
   'Customer Support',
   'beginner',
   '[{"title":"Define categories","description":"Created a list of support categories and priority levels"},{"title":"Build classification prompt","description":"Wrote a prompt that analyzes email content and assigns category + priority"}]',
   false,
   'pending',
   '00000000-0000-0000-0000-000000000001');
