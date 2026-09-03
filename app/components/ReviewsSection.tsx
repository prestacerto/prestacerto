'use client';
import { useState } from 'react';

export default function ReviewsSection() {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const reviews = [
    { author: 'Fernanda Costa', rating: 5, text: 'Trabalho impecável, superou expectativas. Recomendo!', date: 'há 2 semanas', verified: true },
    { author: 'Paulo Mendes', rating: 5, text: 'Entrega no prazo, comunicação clara, resultado profissional.', date: 'há 1 mês', verified: true },
    { author: 'Camila Prado', rating: 4, text: 'Bom trabalho, pequenos ajustes necessários mas responsivo.', date: 'há 1 mês', verified: true },
  ];

  return (
    <>
      <style>{`
        .reviews-container { max-width: 900px; margin: 40px auto; padding: 0 40px; }
        .reviews-header { display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center; margin-bottom: 24px; }
        .reviews-title { font-size: 24px; font-weight: 700; color: #1d174f; margin: 0; }
        .reviews-avg { display: grid; text-align: center; gap: 6px; }
        .avg-stars { font-size: 28px; }
        .avg-text { font-size: 12px; color: #5d5969; }
        .reviews-list { display: grid; gap: 12px; margin-bottom: 24px; }
        .review-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .review-header { display: grid; grid-template-columns: 1fr auto; gap: 12px; margin-bottom: 12px; }
        .review-author { font-weight: 700; color: #1d174f; margin: 0; font-size: 13px; }
        .review-meta { font-size: 11px; color: #a8a3b5; display: flex; gap: 6px; align-items: center; }
        .review-verified { background: #d5f7c7; color: #1f9b62; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; }
        .review-stars { color: #ffc107; font-size: 12px; }
        .review-text { color: #5d5969; font-size: 12px; line-height: 1.5; margin: 0; }
        .review-form { background: #f9f7f3; border-radius: 12px; padding: 20px; }
        .form-label { font-size: 12px; font-weight: 700; color: #1d174f; margin-bottom: 8px; display: block; }
        .star-selector { display: flex; gap: 6px; margin-bottom: 12px; }
        .star { font-size: 24px; cursor: pointer; opacity: 0.3; transition: opacity 0.2s; }
        .star.active { opacity: 1; }
        .review-textarea { width: 100%; border: 2px solid #ece9e4; border-radius: 8px; padding: 12px; font-size: 12px; font-family: inherit; resize: none; }
        .review-textarea:focus { outline: 0; border-color: #ef4b31; }
        .review-btn { background: #ef4b31; color: white; border: 0; padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 12px; }
      `}</style>

      <div className="reviews-container">
        <div className="reviews-header">
          <h2 className="reviews-title">⭐ Avaliações (12)</h2>
          <div className="reviews-avg">
            <div className="avg-stars">4.9</div>
            <div className="avg-text">Baseado em 12 projetos</div>
          </div>
        </div>

        <div className="reviews-list">
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <div>
                  <p className="review-author">{r.author}</p>
                  <div className="review-meta">
                    <span className="review-stars">{'⭐'.repeat(r.rating)}</span>
                    <span>{r.date}</span>
                    {r.verified && <span className="review-verified">✓ Projeto Verificado</span>}
                  </div>
                </div>
              </div>
              <p className="review-text">"{r.text}"</p>
            </div>
          ))}
        </div>

        {!showForm ? (
          <button className="review-btn" onClick={() => setShowForm(true)}>
            + Deixar Avaliação
          </button>
        ) : (
          <div className="review-form">
            <label className="form-label">Sua avaliação</label>
            <div className="star-selector">
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} className={`star ${n <= rating ? 'active' : ''}`} onClick={() => setRating(n)}>⭐</span>
              ))}
            </div>
            <label className="form-label">Conte sua experiência</label>
            <textarea className="review-textarea" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Compartilhe detalhes sobre o trabalho, comunicação e resultado..." />
            <button className="review-btn" style={{marginTop: 12}} onClick={() => { setShowForm(false); setComment(''); }}>
              Publicar Avaliação
            </button>
          </div>
        )}
      </div>
    </>
  );
}
