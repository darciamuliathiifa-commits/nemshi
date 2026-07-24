-- Index for the Eksplor page's location filter (WHERE ads.location = ?).
create index ads_location_idx on ads (location);
