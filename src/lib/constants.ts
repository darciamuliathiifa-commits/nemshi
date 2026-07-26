export const SEED_OWNER_IDS = Array.from(
  { length: 12 },
  (_, i) => `10000000-0000-0000-0000-0000000000${String(i + 1).padStart(2, "0")}`,
);
