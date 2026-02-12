# Smart Bookmark App

A modern bookmark manager built with Next.js, Supabase, and Tailwind CSS. Manage your bookmarks efficiently with real-time updates, Google OAuth authentication, and private bookmark storage.

## Features

- **Google OAuth Authentication**: Sign up and log in using your Google account
- **Add Bookmarks**: Save URLs with titles for easy reference
- **Private Bookmarks**: Each user's bookmarks are private and secure with Row Level Security (RLS)
- **Delete Bookmarks**: Remove bookmarks you no longer need
- **Real-Time Updates**: Bookmarks update instantly across tabs using SWR data fetching
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR for client-side caching and real-time sync
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project

### Installation

1. **Clone the repository** (or extract the ZIP file)

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   The app requires Supabase environment variables. You can find these in your Supabase project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - Other Postgres connection strings

   These are automatically configured if deployed to Vercel with Supabase integration.

4. **Set up the database**:
   The bookmarks table will be created automatically. To manually verify it exists, you can run:
   ```bash
   pnpm exec tsx scripts/001_create_bookmarks.sql
   ```

5. **Run the development server**:
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

1. Visit the app and you'll be redirected to the login page
2. Click "Sign in with Google" or use email/password authentication
3. Create an account or log in with existing credentials

### Managing Bookmarks

1. **Add a Bookmark**:
   - Enter the title and URL in the form
   - Click "Add Bookmark"

2. **View Bookmarks**:
   - All your bookmarks appear in the list below the form
   - Click the external link icon to open a bookmark in a new tab

3. **Delete a Bookmark**:
   - Click the trash icon next to any bookmark
   - Confirm the deletion

## Project Structure

```
├── app/
│   ├── api/
│   │   └── bookmarks/          # Bookmark API routes
│   ├── auth/
│   │   ├── login/              # Login page
│   │   ├── sign-up/            # Sign up page
│   │   └── ...                 # Other auth pages
│   ├── protected/              # Main bookmarks dashboard
│   ├── page.tsx                # Home (redirects based on auth)
│   └── layout.tsx              # Root layout
├── components/
│   ├── add-bookmark.tsx        # Form to add bookmarks
│   ├── bookmark-list.tsx       # List of bookmarks
│   └── ui/                     # shadcn/ui components
├── lib/
│   └── supabase/               # Supabase client setup
├── middleware.ts               # Session management
└── scripts/
    └── 001_create_bookmarks.sql # Database schema
```

## Key Features Explained

### Real-Time Updates
The app uses SWR (stale-while-revalidate) for data fetching. When you add a bookmark, the list automatically refreshes without page reload. If you open two tabs and add a bookmark in one, it will appear in the other tab.

### Row Level Security (RLS)
All bookmarks are protected with Supabase RLS policies. Users can only see and modify their own bookmarks. This is enforced at the database level for maximum security.

### Google OAuth
Sign in with your Google account for a seamless authentication experience. The app uses Supabase's built-in OAuth providers.

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   - Add all Supabase environment variables in Vercel project settings
   - Redeploy after adding variables

4. **Deploy**:
   - Your app will be live at a Vercel URL

## Problems Encountered and Solutions

### 1. Hydration Mismatch Errors
**Problem**: Browser extensions (like Bitwarden password manager) were adding attributes to the DOM (`bis_status`, `bis_frame_id`), causing SSR/client hydration mismatches.

**Solution**: Added `suppressHydrationWarning` to the `<html>` tag in `app/layout.tsx` to allow React to ignore these extension-added attributes without breaking functionality.

### 2. Supabase Module Import Issues
**Problem**: Initial implementation tried to use `@supabase/ssr` package which required additional SSR-specific setup, causing build failures.

**Solution**: Simplified to use `@supabase/supabase-js` directly for both client and server components. This eliminates the need for cookie management in client code and reduces dependencies.

### 3. Real-Time Updates Not Syncing Across Tabs
**Problem**: Bookmarks added in one tab weren't appearing in another tab without manual refresh.

**Solution**: Implemented SWR (stale-while-revalidate) for client-side data fetching with automatic revalidation. SWR handles cache invalidation and refetching when data changes, enabling true real-time sync across tabs.

### 4. Database RLS Configuration
**Problem**: Without Row Level Security, all users could potentially access other users' bookmarks.

**Solution**: Implemented RLS policies at the database level using Supabase policies that enforce `auth.uid() = user_id` for all CRUD operations, ensuring data privacy.

### 5. User Session Management
**Problem**: Session tokens weren't being properly refreshed, causing users to get logged out unexpectedly.

**Solution**: Used Supabase's built-in session handling through the middleware and server-side client, which automatically manages token refresh and cookie updates.

## Architecture Decisions

1. **SWR for Data Fetching**: Chosen for client-side state management with built-in caching and revalidation for real-time bookmark updates.

2. **API Routes**: Used for backend logic with server-side Supabase client to ensure secure database operations with proper user validation.

3. **Middleware**: Handles session management and token refresh to maintain user authentication state.

4. **Row Level Security**: Implemented at the database level for maximum security, preventing unauthorized access to other users' bookmarks.

## Future Enhancements

- Search and filter bookmarks
- Organize bookmarks with categories/tags
- Share bookmarks with other users
- Export bookmarks as JSON or HTML
- Import bookmarks from browser
- Bookmark descriptions/notes
- Sort bookmarks by date, title, or custom order

## Support

For issues or questions:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the [Next.js Documentation](https://nextjs.org/docs)
3. Open an issue on GitHub (if applicable)
