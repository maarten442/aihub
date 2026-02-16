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
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
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

-- Seed data: Example frictions
INSERT INTO frictions (title, description, category, frequency, status, submitted_by, votes) VALUES
  ('Manual report generation takes hours', 'Every Monday I spend 3 hours copying data from multiple sources into a weekly report. This could be automated with AI.', 'Data & Reporting', 'weekly', 'approved', '00000000-0000-0000-0000-000000000001', 12),
  ('Translating customer emails manually', 'We get customer emails in 5+ languages and manually translate them before routing. An AI translation layer would save significant time.', 'Communication', 'daily', 'approved', '00000000-0000-0000-0000-000000000001', 8),
  ('No consistent meeting summaries', 'Meeting notes are inconsistent or missing entirely. AI transcription and summarization would help.', 'Meetings & Collaboration', 'daily', 'pending', '00000000-0000-0000-0000-000000000001', 5);
