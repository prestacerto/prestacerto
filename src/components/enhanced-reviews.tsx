"use client";

import { useState } from "react";
import { Star, Upload, Send } from "lucide-react";

export interface ReviewRating {
  quality: number; // 1-5
  communication: number;
  deadline: number;
  price: number;
  professionalism: number;
}

export function EnhancedReviews() {
  const [ratings, setRatings] = useState<ReviewRating>({
    quality: 0,
    communication: 0,
    deadline: 0,
    price: 0,
    professionalism: 0,
  });

  const [comment, setComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { key: "quality", label: "Qualidade do Trabalho", icon: "⭐" },
    { key: "communication", label: "Comunicação", icon: "💬" },
    { key: "deadline", label: "Respeito a Prazo", icon: "⏰" },
    { key: "price", label: "Custo-Benefício", icon: "💰" },
    { key: "professionalism", label: "Profissionalismo", icon: "🎯" },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const avgRating =
      (Object.values(ratings).reduce((a, b) => a + b, 0) / 5) | 0;

    // TODO: Submit to /api/reviews
    console.log("Review submitted:", {
      ratings,
      comment,
      photoUrl,
      avgRating,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRatings({ quality: 0, communication: 0, deadline: 0, price: 0, professionalism: 0 });
      setComment("");
      setPhotoUrl(null);
    }, 2000);
  };

  const avgRating = Object.values(ratings).filter((r) => r > 0).length > 0
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) /
        Object.values(ratings).filter((r) => r > 0).length) | 0
    : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        ⭐ Avalie este Trabalho
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Sua avaliação ajuda outros clientes a encontrar os melhores freelancers
      </p>

      {/* 5-Category Ratings */}
      <div className="space-y-6 mb-8">
        {categories.map((cat) => (
          <div key={cat.key}>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-900 dark:text-white">
                {cat.icon} {cat.label}
              </label>
              {ratings[cat.key as keyof ReviewRating] > 0 && (
                <span className="text-sm font-bold text-blue-600">
                  {ratings[cat.key as keyof ReviewRating]}/5
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setRatings({
                      ...ratings,
                      [cat.key]: star,
                    })
                  }
                  className={`text-3xl transition-transform hover:scale-110 ${
                    ratings[cat.key as keyof ReviewRating] >= star
                      ? "opacity-100"
                      : "opacity-30"
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Upload */}
      <div className="mb-8">
        <label className="block font-semibold text-slate-900 dark:text-white mb-3">
          📸 Foto da Entrega (Opcional)
        </label>
        <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="size-5 text-slate-500" />
          <span className="text-slate-600 dark:text-slate-400">
            Enviar foto
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
        {photoUrl && (
          <div className="mt-4">
            <img
              src={photoUrl}
              alt="Review photo"
              className="max-h-48 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Comment */}
      <div className="mb-8">
        <label className="block font-semibold text-slate-900 dark:text-white mb-2">
          💭 Seu Comentário
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência com este freelancer..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {comment.length}/500 caracteres
        </p>
      </div>

      {/* Average Rating Display */}
      {avgRating > 0 && (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⭐</span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Nota Geral: {avgRating}/5
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Com base em suas 5 avaliações
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={avgRating === 0 || submitted}
        className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <Send className="size-4" />
        {submitted ? "✅ Avaliação Enviada!" : "Enviar Avaliação"}
      </button>
    </div>
  );
}

export function ReviewsList() {
  // Mock reviews with 5-point ratings
  const reviews = [
    {
      id: 1,
      author: "João Silva",
      avatar: "👨‍💼",
      ratings: {
        quality: 5,
        communication: 5,
        deadline: 5,
        price: 4,
        professionalism: 5,
      },
      comment: "Perfeito! Exatamente o que pedimos. Muito profissional.",
      photoUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200",
      date: "2 dias atrás",
    },
    {
      id: 2,
      author: "Maria Santos",
      avatar: "👩‍💼",
      ratings: {
        quality: 4,
        communication: 5,
        deadline: 4,
        price: 5,
        professionalism: 4,
      },
      comment: "Ótimo trabalho! Entrega no prazo.",
      photoUrl: null,
      date: "1 semana atrás",
    },
  ];

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Avaliações Recentes
      </h3>
      {reviews.map((review) => {
        const avgRating =
          Math.round(
            (Object.values(review.ratings).reduce((a, b) => a + b, 0) / 5) * 10
          ) / 10;
        return (
          <div
            key={review.id}
            className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{review.avatar}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {review.author}
                  </p>
                  <span className="text-sm text-slate-500">{review.date}</span>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <span>Qualidade: {review.ratings.quality}⭐</span>
                  <span>Comunicação: {review.ratings.communication}⭐</span>
                  <span>Prazo: {review.ratings.deadline}⭐</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{avgRating}</p>
                <p className="text-xs text-slate-500">/ 5</p>
              </div>
            </div>
            {review.photoUrl && (
              <img
                src={review.photoUrl}
                alt="Work sample"
                className="w-24 h-24 rounded-lg object-cover mb-3"
              />
            )}
            <p className="text-slate-700 dark:text-slate-300">
              {review.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
}
