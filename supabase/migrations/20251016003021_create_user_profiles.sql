-- Create user_profiles table
create table public.user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Basic profile info
  first_name text,
  last_name text,
  email text,
  
  -- Company/role related
  company_name text,
  role text check (role in ('boss', 'worker')),
  company_id uuid references public.user_profiles(id), -- References the boss's profile
  
  -- Optional fields
  avatar_url text,
  phone text
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Bosses can view their workers' profiles
create policy "Bosses can view workers profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role = 'boss'
      and user_profiles.company_id = auth.uid()
    )
  );

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, role)
  values (new.id, new.email, 'boss'); -- Default to boss, can be changed
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
