# Qhemegha Senior Primary School — website & staff portal

A public-facing website plus a password-protected staff portal for Qhemegha Senior Primary School, built with **Next.js 15 (App Router + TypeScript)**, **Tailwind CSS**, and **Supabase**.

## Features

- Public pages: Home, About, Academics, Staff, News/Gallery, Apply Online, Contact
- Staff portal at `/staff/*` with role-based access
- Editable page content, news posts, staff directory and applications
- Online admissions form with file uploads
- Supabase Row Level Security matching the provided `qhemegha-sps-schema.sql`

## Local setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

3. Run the Supabase schema (`qhemegha-sps-schema.sql`) in the Supabase SQL Editor.

4. Create the following Supabase Storage buckets with public access for images:
   - `news-images`
   - `staff-photos`
   - `supporting-docs`

5. Create the first admin user:

   - Go to Supabase Auth, create a user for Mr Maqhubu.
   - Insert a matching row into `staff_users` with `role = 'admin'`.

6. Start the dev server:

```bash
npm run dev
```

The site runs on `http://localhost:3000` and the staff portal at `/staff`.

## Vercel deployment

1. Create a new GitHub repository and push this project.
2. Create a new project in Vercel and link it to the GitHub repository.
3. Add the environment variables from `.env.example` to Vercel.
4. Every push to `main` will automatically deploy.

## Staff roles

- `admin` — full access, including user management
- `editor` — can edit content, news, staff directory and applications, but cannot manage other staff accounts

## Project structure

- `app/` — public pages and staff portal routes
- `components/public/` — shared public UI (nav, footer, ribbon)
- `components/staff/` — staff portal manager components
- `lib/data.ts` — data fetching helpers
- `lib/actions.ts` — server actions for mutations
- `lib/supabase/` — Supabase browser, server and admin clients
- `middleware.ts` — protects `/staff/*` and enforces admin-only `/staff/users`
- `qhemegha-sps-schema.sql` — database schema and RLS policies

## Notes

- `next.config.ts` intentionally left minimal. Static export is not used because the site relies on server-side Supabase rendering.
- The design uses a deep navy, muted gold, warm sand and brick-red palette inspired by the school crest and uniform.
- Out of scope for phase one: parent/student portal, payment processing, SMS/email notifications.
