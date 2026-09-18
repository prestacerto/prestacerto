'use client';
import { useState, useEffect } from 'react';

export default function ReviewsIntegrated({ userId }: { userId?: string }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/review?userId=${userId || ''}`).then(r => r.json()).then(d => setReviews(d.reviews));
  }, [userId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, rating, comment })
      });
      setComment('');
      setRating(5);
      alert('Avaliação enviada com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#1d174f' }}>⭐ Avaliações</h2>

      <div style={{ background: 'white', border: '1px solid #e5e0eb', borderRadius: '12px', padding: '20px', marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', color: '#ef4b31', fontWeight: 700, marginBottom: '8px' }}>4.8</div>
        <div style={{ fontSize: '13px', color: '#5d5969', marginBottom: '16px' }}>Baseado em {reviews.length} avaliações</div>
        <div style={{ height: '4px', background: '#ece9e4', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#ef4b31', width: '96%' }} />
        </div>
      </div>

      <form onSubmit={handleSubmitReview} style={{ background: '#f9f8f7', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d174f', display: 'block', marginBottom: '8px' }}>Sua avaliação</label>
          <div style={{ display: 'flex', gap: '8px', fontSize: '24px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: star <= rating ? 1 : 0.3 }}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>
        <textarea
          placeholder="Compartilhe sua experiência..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ece9e4', fontSize: '13px', fontFamily: 'inherit', marginBottom: '12px', minHeight: '80px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#ef4b31', color: 'white', border: 0, borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>

      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#1d174f' }}>Avaliações Recentes</h3>
        {reviews.map((rev: any) => (
          <div key={rev.id} style={{ background: 'white', border: '1px solid #e5e0eb', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d174f' }}>{rev.author}</div>
              <div style={{ fontSize: '12px', color: '#5d5969' }}>{rev.date}</div>
            </div>
            <div style={{ fontSize: '12px', color: '#ef4b31', marginBottom: '8px' }}>{'⭐'.repeat(rev.rating)}</div>
            <div style={{ fontSize: '13px', color: '#5d5969' }}>{rev.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
