"use client";

import { useState } from "react";
import { StarRating } from "@/components/star-rating";
import { StarRatingInput } from "@/components/star-rating-input";

type Testimonial = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
};

type TestimonialsData = {
  items: Testimonial[];
  averageRating: number | null;
  totalCount: number;
};

export function TestimonialsSection({
  userId,
  initialData,
}: {
  userId: string;
  initialData: TestimonialsData;
}) {
  const [data, setData] = useState(initialData);
  const [showForm, setShowForm] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!reviewerName.trim()) {
      setError("Nama wajib diisi.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Ulasan minimal 10 karakter.");
      return;
    }

    setSubmitting(true);
    const response = await fetch(`/api/users/${userId}/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewerName, rating, comment }),
    });
    setSubmitting(false);

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? "Gagal mengirim testimoni.");
      return;
    }

    const newTestimonial = await response.json();
    setData((prev) => {
      const items = [newTestimonial, ...prev.items];
      const totalCount = prev.totalCount + 1;
      const averageRating =
        ((prev.averageRating ?? 0) * prev.totalCount + newTestimonial.rating) / totalCount;
      return { items, totalCount, averageRating };
    });
    setReviewerName("");
    setRating(5);
    setComment("");
    setShowForm(false);
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-text">Testimoni</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            + Beri Testimoni
          </button>
        )}
      </div>

      {data.totalCount > 0 && (
        <div className="mb-3 flex items-center gap-1 text-sm text-text-secondary">
          <StarRating rating={data.averageRating ?? 0} />
          <span>
            {data.averageRating?.toFixed(1)} ({data.totalCount} testimoni)
          </span>
        </div>
      )}

      {showForm && (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-black/5 bg-white p-4">
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Nama kamu"
            className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <StarRatingInput value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bagaimana pengalamanmu menggunakan jasa ini? (minimal 10 karakter)"
            rows={3}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Mengirim..." : "Kirim Testimoni"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-black/10 px-4 py-2 text-sm text-text-secondary"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {data.items.length === 0 ? (
        <p className="text-sm text-text-secondary">Belum ada testimoni.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.items.map((testimonial) => (
            <li key={testimonial.id} className="rounded-xl border border-black/5 bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-text">{testimonial.reviewerName}</span>
                <StarRating rating={testimonial.rating} size="text-sm" />
              </div>
              <p className="text-sm text-text-secondary">{testimonial.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
