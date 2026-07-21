"use client";

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1 text-2xl text-primary">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Beri rating ${star}`}
          onClick={() => onChange(star)}
          className="leading-none"
        >
          {star <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
