-- Fix infinite recursion in RLS policy
drop policy if exists "Bosses can view workers profiles" on public.user_profiles;

create policy "Bosses can view workers profiles"
  on public.user_profiles for select
  using (
    -- Workers can be viewed by their boss (company_id points to boss)
    company_id = auth.uid()
  );