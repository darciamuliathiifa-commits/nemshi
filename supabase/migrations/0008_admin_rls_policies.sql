-- The existing RLS policies only let a reporter see their own report, and
-- only an ad's owner update it. Admin endpoints (require-admin.ts gates
-- them at the app level) also need RLS to actually allow the row access,
-- otherwise Postgres denies it regardless of the app-level check.

create policy "Admins can view all reports" on ad_reports
  for select using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin)
  );

create policy "Admins can update all reports" on ad_reports
  for update using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin)
  );

create policy "Admins can update any ad" on ads
  for update using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin)
  );
