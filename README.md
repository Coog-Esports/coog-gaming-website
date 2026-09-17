# Coog Gaming — Contribution Guide

## Overview

Hey this is the main repo for the coog gaming site

Submit all changes through pull requests and log onto the coog-gaming github account to merge changes onto staging/main

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Next.js Server Actions and server-side data-access modules
- **Authentication:** Supabase Auth with cookie-based sessions
- **Database:** PostgreSQL via Drizzle ORM and `postgres-js`
- **File storage:** Supabase Storage
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI, `next-themes`
- **Package manager:** pnpm
- **Testing:** Jest and Testing Library
- **Hosting / deployment:** Hosted on Vercel

## Local Setup

1. Fork the repository on GitHub and clone your fork.

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create your own local .env.local file using the example template: 
  
  ```cp .env.example .env.local```
  then just add the required values/keys needed


4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Before opening a pull request, run the relevant checks:

   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

## Branching and Contribution Workflow

The intended long-lived branches are:

- `main` — stable, production-ready code
- `staging` — shared integration and testing branch

For each focused change:

1. Sync your fork with the upstream repository.
2. Create a branch from the current `staging` branch:

   ```bash
   git checkout staging
   git pull upstream staging
   git checkout -b feature/short-description
   ```

3. Make the change and update documentation when behavior, environment variables, setup, or operations change.
4. Run relevant local checks.
5. Commit with a clear, focused message:

   ```bash
   git commit -m "Add short description"
   ```

6. Push the branch to your fork:

   ```bash
   git push origin feature/short-description
   ```

7. Open a pull request into `staging`.
8. Address review feedback and validate the change in the staging environment.
9. A maintainer merges validated `staging` changes into `main`.

Do not push directly to `staging` or `main`.

## Pull Request Recommendations

- I would recommend keeping each change small and focused
- Clearly explain what changed and why
- Taking screenshots of UI before and after your changes
- Do not include credentials, API keys, `.env.local`, or production data in commits or screenshots.

## Important Files and Folders

- `app/` — Next.js routes, layouts, and pages
- `components/` — reusable UI components
- `components/site-components/` — site, visitor-calendar, and admin UI
- `components/ui/` — shadcn/ui primitives
- `server/` — server-side data-access and action modules
- `db/` — Drizzle client, schema definitions, and seed data
- `lib/supabase/` — Supabase browser, server, proxy, and admin clients
- `proxy.ts` — request-time session refresh and route protection
- `public/` — static assets
- `drizzle.config.ts` — Drizzle configuration
- `AGENTS.md` — project architecture and implementation guidance

## Architecture Notes

- **Supabase is used for authentication and storage.** Application data is stored through Drizzle in PostgreSQL.
- **Server modules return safe results.** Functions in `server/` use a shared action wrapper and return `{ data, error }` instead of throwing errors to callers.
- **Session handling is sensitive.** Supabase client instances must be created per request, and the proxy session-refresh flow should not be rearranged without careful testing.


## Database and Seed Data

Schema definitions live in `db/schema/`

When setting up your own Supabase project, apply the database migrations first, then run: pnpm db:seed
This creates the project’s test data in your local database.


## Ownership and Access

The coog-gaming GitHub account is managed by the club. The project’s Supabase and Vercel accounts, for the database and hosting, are connected to that GitHub account.