-- Lets a community/organization (kekeluargaan, klub, komunitas belajar, dll)
-- list itself on Nemsyi as a free "jasa" ad instead of getting dumped into
-- "Lainnya" — no dedicated fields needed, description + WA contact cover it.
alter type ad_category add value if not exists 'Event & Komunitas';
