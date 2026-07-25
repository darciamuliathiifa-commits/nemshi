-- Real Mayar integration replaces the mocked checkout flow (which just
-- POSTed a fake "payment.success" event straight from the browser). We now
-- create a real invoice via Mayar's API and record it as 'pending' before
-- redirecting the user to Mayar's hosted checkout; the webhook then flips
-- it to 'success' once Mayar confirms payment.
--
-- mayar_invoice_id / mayar_transaction_ref store both ids Mayar's Create
-- Invoice response returns (id and transactionId) — the webhook payload's
-- exact correlation field isn't documented, so we match against either.
alter table mayar_transactions add column mayar_invoice_id text;
alter table mayar_transactions add column mayar_transaction_ref text;
alter table mayar_transactions alter column status set default 'pending';

create unique index mayar_transactions_invoice_id_idx
  on mayar_transactions (mayar_invoice_id)
  where mayar_invoice_id is not null;
create index mayar_transactions_transaction_ref_idx
  on mayar_transactions (mayar_transaction_ref)
  where mayar_transaction_ref is not null;
