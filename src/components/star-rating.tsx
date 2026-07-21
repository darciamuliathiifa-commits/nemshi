export function StarRating({ rating, size = "text-base" }: { rating: number; size?: string }) {
  const rounded = Math.round(rating);
  return (
    <span className={`${size} text-primary`} aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }, (_, i) => (i < rounded ? "★" : "☆")).join("")}
    </span>
  );
}
