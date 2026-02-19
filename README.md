# Smart Bookmarks

A private bookmark manager built with Next.js 15 (App Router), Supabase, and Tailwind CSS.

## Live Demo

[  ]

## Features

- **Google OAuth** — Sign in with Google (no email/password)
- **Private bookmarks** — Each user sees only their own bookmarks (RLS enforced at DB level)
- **Add bookmarks** — Save any URL with a custom title
- **Delete bookmarks** — Remove bookmarks with one click
- **Real-time updates** — SWR polls every 3 seconds; open two tabs and bookmarks sync automatically
- **Search** — Filter bookmarks by title or URL
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth + Database**: Supabase (PostgreSQL + Row Level Security)
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR (stale-while-revalidate, with `refreshInterval: 3000`)
- **Deployment**: Vercel

## Project Structure

```
smart-bookmarks/
├── app/
│   ├── api/bookmarks/
│   │   ├── route.ts          # GET (list) + POST (create)
│   │   └── [id]/route.ts     # DELETE
│   ├── auth/
│   │   ├── callback/route.ts # OAuth callback
│   │   └── login/page.tsx    # Login page
│   ├── protected/
│   │   ├── layout.tsx        # Auth guard
│   │   └── page.tsx          # Main dashboard
│   ├── layout.tsx
│   ├── page.tsx              # Redirects based on auth
│   └── globals.css
├── components/
│   └── BookmarkDashboard.tsx # Main UI component
├── lib/supabase/
│   ├── client.ts             # Browser Supabase client
│   └── server.ts             # Server Supabase client
├── middleware.ts              # Session refresh + route protection
└── schema.sql                # Database schema + RLS policies
```

## Getting Started (Local)

### 1. Clone and install

```bash
git clone https://github.com/your-username/smart-bookmarks
cd smart-bookmarks
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `schema.sql`
3. Go to **Authentication → Providers → Google** and enable Google OAuth
   - You'll need a Google Cloud project with OAuth credentials
   - Set the callback URL to: `https://your-project.supabase.co/auth/v1/callback`

### 3. Configure environment variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in Supabase → Project Settings → API.

### 4. Run locally

```bash
npm run dev
```

## Deployment on Vercel

1. Push your code to GitHub (make sure only this folder's contents are pushed — no `.git` internals)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. In Vercel project settings, add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. In Supabase → Authentication → URL Configuration, add your Vercel URL:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/auth/callback`
6. In Google Cloud Console → OAuth credentials → Authorized redirect URIs, add:
   - `https://your-project.supabase.co/auth/v1/callback`

## Problems Encountered and Solutions

### 1. Repo structure was corrupted

**Problem**: Files were accidentally committed to the root of the repo instead of inside proper `app/`, `components/`, `lib/` directories. Git internals (`.git/hooks`, `HEAD`, etc.) were also committed as regular files.

**Solution**: Rebuilt the entire project from scratch with correct Next.js App Router structure. Ensured `.gitignore` excludes the `.git` folder and all build artifacts.

### 2. Hydration mismatch from browser extensions

**Problem**: Password manager extensions (Bitwarden, 1Password) inject attributes into the DOM, causing React SSR/client hydration mismatches.

**Solution**: Added `suppressHydrationWarning` to the `<html>` tag in `app/layout.tsx`.

### 3. Real-time updates across tabs

**Problem**: SWR doesn't natively subscribe to Supabase Realtime channels in SSR environments without additional setup.

**Solution**: Used SWR's `refreshInterval: 3000` to poll the API every 3 seconds. Combined with `revalidateOnFocus: true`, this means switching browser tabs triggers an immediate refetch, making updates appear within 3 seconds in a passive tab.

### 4. OAuth redirect URLs in production

**Problem**: Google OAuth redirected back to `localhost` even in production, because the callback URL was hardcoded.

**Solution**: Used `window.location.origin` dynamically in the client-side login to construct the `redirectTo` URL, so it always matches the current domain.

### 5. Row Level Security setup

**Problem**: Without RLS, any authenticated user could query any other user's bookmarks via the Supabase client.

**Solution**: Enabled RLS on the `bookmarks` table and added separate policies for SELECT, INSERT, and DELETE that enforce `auth.uid() = user_id`. All mutations also go through server-side API routes that re-validate the user.
