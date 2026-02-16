# AI Hub

Internal web app to drive AI adoption through monthly missions, a location-based leaderboard, and a Wall of Friction to surface recurring problems.

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL and Service Role Key
3. Run the SQL migration in `supabase/schema.sql` via the Supabase SQL Editor
4. Create a Storage bucket called `submissions` (private, 10MB limit)
5. Install dependencies and run:

```bash
npm install
npm run dev
```

## Tech Stack

- **Next.js 15** (App Router, Server Components)
- **TypeScript** + **Tailwind CSS v4**
- **Supabase** (Postgres + Storage)
- **Zod v4** for validation
- **Lucide React** for icons

## Features

- Monthly AI missions/challenges with submission workflow
- Location-based leaderboard (participation rate per hub)
- Wall of Friction for surfacing pain points
- Role toggle (user/moderator) via cookie
- Moderator panel for managing challenges, reviewing submissions, and approving frictions
- File upload to Supabase Storage
