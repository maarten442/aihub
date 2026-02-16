# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

No test framework is configured.

## Environment

Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)

Database schema lives in `supabase/schema.sql`. A Supabase Storage bucket named `submissions` (private, 10MB limit) is required for file uploads.

## Architecture

Next.js 15 App Router with TypeScript, Tailwind CSS v4, Supabase (Postgres + Storage), and Zod v4 for validation.

### Key directories

- `src/app/` — Pages and API routes (App Router conventions)
- `src/app/api/` — REST endpoints: `challenges`, `submissions`, `frictions`, `leaderboard`, `locations`, `uploads`, `me`
- `src/components/ui/` — Reusable UI primitives (card, button, input, badge, etc.)
- `src/lib/` — Supabase client (`supabase.ts`), auth helpers (`auth.ts`), Zod schemas (`validations.ts`)
- `src/types/` — TypeScript interfaces

### Auth & roles

No real auth — a hardcoded mock user is used (`lib/auth.ts`). Role (user/moderator) is toggled via the `aihub_view_role` cookie. Use `getUser()` to get the current user and `requireModerator()` to guard moderator-only endpoints.

### Data access

Direct Supabase JS SDK queries (no ORM). The `supabase` export from `lib/supabase.ts` is a lazy-initialized proxy — import and use it directly. Queries often use nested selects for joins (e.g., `select('*, user:users(*)')`).

### Validation

All request body validation uses Zod schemas from `lib/validations.ts`. API routes call `schema.safeParse(body)` and return 400 with validation issues on failure.

### API patterns

- Standard REST: GET (list/single), POST (create), PATCH (update)
- Moderator-only endpoints call `requireModerator()` and return 403 on failure
- Duplicate submission detection returns 409
- File uploads go to Supabase Storage under `{user_id}/{timestamp}.{ext}`, accessed via signed URLs (1-hour expiry)

### Styling

Tailwind v4 with custom theme defined in `globals.css` (purple primary, orange accent). Path alias: `@/*` maps to `src/*`.
