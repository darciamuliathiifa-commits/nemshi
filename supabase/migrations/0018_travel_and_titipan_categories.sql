-- New ad/sayembara categories for travel-related listings (visa, tiket,
-- open trip) and baggage/shipping requests (titip barang, kirim bagasi) —
-- previously these had no good home besides "Lainnya".
alter type ad_category add value if not exists 'Perjalanan & Travel';
alter type ad_category add value if not exists 'Titipan & Bagasi';
