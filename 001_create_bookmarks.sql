-- Create bookmarks table
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Create RLS policies
create policy "Allow users to view their own bookmarks" 
  on public.bookmarks for select 
  using (auth.uid() = user_id);

create policy "Allow users to insert their own bookmarks" 
  on public.bookmarks for insert 
  with check (auth.uid() = user_id);

create policy "Allow users to update their own bookmarks" 
  on public.bookmarks for update 
  using (auth.uid() = user_id);

create policy "Allow users to delete their own bookmarks" 
  on public.bookmarks for delete 
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);
create index if not exists bookmarks_created_at_idx on public.bookmarks(created_at desc);
