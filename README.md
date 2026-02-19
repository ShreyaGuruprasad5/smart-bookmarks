# Smart Bookmarks

A private bookmark manager built with Next.js 15, Supabase, and Tailwind CSS.

## Live Demo

https://smart-bookmarks-appppp.vercel.app

## Features

- **Google OAuth only** — Sign in with Google (no email/password)
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
│   │   ├── callback/route.ts # OAuth callback handler
│   │   └── login/page.tsx    # Login page with Google button
│   ├── protected/
│   │   ├── layout.tsx        # Auth guard - redirects if not logged in
│   │   └── page.tsx          # Main dashboard
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Redirects based on auth state
│   └── globals.css
├── components/
│   └── BookmarkDashboard.tsx # Main UI - add, list, delete, search
├── lib/supabase/
│   ├── client.ts             # Browser Supabase client
│   └── server.ts             # Server Supabase client
├── middleware.ts              # Session refresh + route protection
└── schema.sql                # Database schema + RLS policies
```

## Problems Encountered and Solutions

### 1. Accidentally committed `.git` internals and wrong file structure

**Problem**: The entire project was generated and exported incorrectly — all source files (`page.tsx`, `route.ts`, `button.tsx`, etc.) ended up at the root of the repository instead of inside proper `app/`, `components/`, and `lib/` directories. On top of that, Git internal files (`HEAD`, `config`, `hooks/`, etc.) were accidentally committed as regular files. Vercel couldn't find `package.json` or the Next.js app structure and failed immediately.

**Solution**: Deleted the corrupted repository entirely. Rebuilt the project from scratch with the correct Next.js App Router folder structure. Created a fresh Git repository and pushed only the actual source files. Also set the correct Root Directory in Vercel settings to point to the inner project folder.

### 2. TypeScript errors blocking Vercel build

**Problem**: Three files had TypeScript errors where the `cookiesToSet` parameter in Supabase's `setAll` cookie handler was implicitly typed as `any`. This caused Vercel's build to fail at the type-checking stage with: `Parameter 'cookiesToSet' implicitly has an 'any' type.` The error appeared in three separate files: `app/auth/callback/route.ts`, `lib/supabase/server.ts`, and `middleware.ts`.

**Solution**: Added explicit TypeScript type annotations to the `setAll` parameter in all three files:
```ts
setAll(cookiesToSet: { name: string; value: string; options?: object }[])
```
This satisfied the TypeScript compiler and the build passed.

### 3. Next.js security vulnerability blocking deployment

**Problem**: Vercel blocked deployment with the error: `Vulnerable version of Next.js detected, please update immediately (CVE-2025-66478)`. Multiple versions were tried (15.1.3, 15.2.3, 15.2.6, 15.3.4, 15.3.6) and each had either the same or a different vulnerability.

**Solution**: Used Vercel's recommended automated tool `npx fix-react2shell-next` which automatically detected the exact patched version needed (`15.3.8`) and updated `package.json` and `package-lock.json` correctly. This resolved all CVE warnings.

### 4. Missing environment variables in Vercel

**Problem**: After fixing all build errors, the app deployed but crashed at runtime with: `@supabase/ssr: Your project's URL and API key are required`. The Supabase client couldn't initialize because the environment variables weren't set in Vercel. Additionally, the variable name was accidentally typed as `NEXT_PUBLIC_SUPABASE_UR` (missing the final `L`), which caused the error to persist even after attempting to add the variables.

**Solution**: Added the correct environment variables in Vercel project settings under Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeployed after adding the variables (Vercel requires a new deployment to pick up env var changes).

### 5. Google OAuth not enabled in Supabase

**Problem**: Clicking "Continue with Google" returned a `400` error: `Unsupported provider: provider is not enabled`. Google OAuth was not enabled in Supabase by default.

**Solution**: 
- Created a Google Cloud project and set up an OAuth consent screen
- Created OAuth credentials (Client ID + Client Secret) with the Supabase callback URL as an authorized redirect URI: `https://<project-id>.supabase.co/auth/v1/callback`
- Enabled the Google provider in Supabase → Authentication → Providers and pasted the credentials
- Added the Vercel deployment URL to Supabase → Authentication → URL Configuration as both the Site URL and an allowed Redirect URL

### 6. Real-time updates across tabs

**Problem**: Needed bookmarks to sync across two open tabs without a manual page refresh, as required by the spec.

**Solution**: Used SWR's `refreshInterval: 3000` to poll the `/api/bookmarks` endpoint every 3 seconds. Combined with `revalidateOnFocus: true`, switching to a tab triggers an immediate refetch. This means any bookmark added in one tab appears in another within 3 seconds — satisfying the real-time requirement without needing Supabase Realtime websockets.

### 7. Row Level Security ensuring data privacy

**Problem**: Without RLS, any authenticated user could potentially query another user's bookmarks directly through the Supabase client.

**Solution**: Enabled RLS on the `bookmarks` table with three separate policies enforcing `auth.uid() = user_id` for SELECT, INSERT, and DELETE operations. All API routes also re-validate the user server-side before any database operation, providing two layers of security.

### 8. Hydration mismatch from browser extensions

**Problem**: Password manager browser extensions inject custom attributes into the DOM, causing React SSR/client hydration mismatches and console errors.

**Solution**: Added `suppressHydrationWarning` to the `<html>` tag in `app/layout.tsx` to allow React to ignore extension-added attributes without breaking functionality.
