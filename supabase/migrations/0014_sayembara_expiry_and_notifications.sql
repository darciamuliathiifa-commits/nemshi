-- Sayembara never had an expiry column (ads already had one from day one,
-- but it was never actually populated on creation, and nothing enforced it —
-- fixed at the application level alongside this migration). Adding it here
-- so both listing types can be expired consistently by the new cron job.
alter table sayembara add column expires_at timestamptz;

create index ads_expires_at_idx on ads (expires_at) where status = 'Aktif';
create index sayembara_expires_at_idx on sayembara (expires_at) where status = 'Aktif';

-- In-app notifications (starting with "someone applied to your sayembara").
-- Written by the service-role client since the actor triggering a
-- notification (e.g. an anonymous applicant) is often not the same user
-- who should receive it, so per-user RLS can't cover the insert.
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on notifications (user_id, created_at desc);

alter table notifications enable row level security;

create policy "Users can view own notifications" on notifications
  for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on notifications
  for update using (auth.uid() = user_id);

-- Admin payment-reconciliation view (mayar_transactions only had a
-- per-user SELECT policy before this).
create policy "Admins can view all transactions" on mayar_transactions
  for select using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin)
  );
