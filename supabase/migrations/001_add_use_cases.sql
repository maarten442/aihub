-- Migration: Add use_cases table
-- Run this if the database already has the base schema

-- Use Cases table
CREATE TABLE IF NOT EXISTS use_cases (
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

CREATE INDEX IF NOT EXISTS idx_use_cases_status ON use_cases(status);
CREATE INDEX IF NOT EXISTS idx_use_cases_category ON use_cases(category);
CREATE INDEX IF NOT EXISTS idx_use_cases_submitted_by ON use_cases(submitted_by);
CREATE INDEX IF NOT EXISTS idx_use_cases_is_featured ON use_cases(is_featured);
CREATE INDEX IF NOT EXISTS idx_use_cases_tools ON use_cases USING GIN(tools);

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
   '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
