'use client';
import { useState } from 'react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Carlos M.', rating: 5, text: 'Excelente trabalho! Entregou no prazo e superou expectativas.', date: '2 semanas atrás', verified: true },
    { id: 2, author: 'Fernanda P.', rating: 5, text: 'Profissional atencioso, boa comunicação e resultado impecável.', date: '1 mês atrás', verified: true },
    { id: 3, author: 'Roberto S.', rating: 4, text: 'Bom trabalho, pequeno atraso mas compensou na qualidade.', date: '2 meses atrás', verified: true },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <>
      <style>{`
        .reviews-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .reviews-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 30px;
          padding-bottom: 24px;
          border-bottom: 1px solid #ece9e4;
        }
        .reviews-stats {
          display: grid;
          gap: 12px;
        }
        .reviews-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1d174f;
        }
        .rating-display {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 32px;
          font-weight: 700;
          color: #ef4b31;
        }
        .rating-stars {
          display: flex;
          gap: 2px;
        }
        .rating-stars span {
          color: #ffc107;
          font-size: 18px;
        }
        .rating-meta {
          font-size: 12px;
          color: #a8a3b5;
        }
        .rating-distribution {
          display: grid;
          gap: 8px;
        }
        .rating-row {
          display: grid;
          grid-template-columns: 40px 1fr 30px;
          gap: 8px;
          align-items: center;
          font-size: 12px;
        }
        .rating-bar {
          height: 6px;
          background: #ece9e4;
          border-radius: 3px;
          overflow: hidden;
        }
        .rating-fill {
          height: 100%;
          background: #ffc107;
        }
        .review-item {
          padding: 16px;
          background: #f9f7f3;
          border-radius: 10px;
          margin-bottom: 12px;
          border-left: 3px solid #ef4b31;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }
        .review-author {
          font-size: 13px;
          font-weight: 700;
          color: #1d174f;
        }
        .review-badge {
          background: #d5f7c7;
          color: #1f9b62;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
        }
        .review-rating {
          font-size: 12px;
          color: #ffc107;
          margin-bottom: 6px;
        }
        .review-text {
          font-size: 12px;
          color: #5d5969;
          line-height: 1.5;
          margin: 0;
        }
        .review-date {
          font-size: 11px;
          color: #a8a3b5;
          margin-top: 8px;
        }
        .new-review {
          background: #f9f7f3;
          border-radius: 10px;
          padding: 16px;
          margin-top: 20px;
        }
        .review-form-group {
          margin-bottom: 12px;
        }
        .review-form-label {
          font-size: 12px;
          font-weight: 700;
          color: #5d5969;
          display: block;
          margin-bottom: 6px;
        }
        .rating-selector {
          display: flex;
          gap: 8px;
        }
        .rating-selector button {
          width: 32px;
          height: 32px;
          border: 2px solid #ece9e4;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }
        .rating-selector button.active {
          border-color: #ef4b31;
          background: #ffe1da;
        }
        .rating-selector button:hover {
          border-color: #ef4b31;
        }
        .review-textarea {
          width: 100%;
          border: 2px solid #ece9e4;
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
          font-family: inherit;
          resize: vertical;
          min-height: 80px;
        }
        .review-submit {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
        }
        .review-submit:hover {
          background: #d4381f;
        }
      `}</style>

      <div className="reviews-section">
        <div className="reviews-header">
          <div className="reviews-stats">
            <h2 className="reviews-title">Avaliações</h2>
            <div className="rating-display">
              <span>{avgRating}</span>
              <div className="rating-stars">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i} style={{opacity: i < Math.floor(avgRating) ? 1 : 0.3}}>★</span>
                ))}
              </div>
            </div>
            <div className="rating-meta">Baseado em {reviews.length} avaliações</div>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const percent = (count / reviews.length) * 100;
              return (
                <div key={star} className="rating-row">
                  <span>{star}★</span>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{width: `${percent}%`}} />
                  </div>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{marginBottom: 20}}>
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-author">
                  {review.author}
                  {review.verified && <span className="review-badge">✓ Verificado</span>}
                </span>
              </div>
              <div className="review-rating">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className="review-text">{review.text}</p>
              <div className="review-date">{review.date}</div>
            </div>
          ))}
        </div>

        <div className="new-review">
          <h3 style={{margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1d174f'}}>Deixe sua avaliação</h3>
          <div className="review-form-group">
            <label className="review-form-label">Classificação</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={newReview.rating === star ? 'active' : ''}
                  onClick={() => setNewReview({...newReview, rating: star})}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="review-form-group">
            <label className="review-form-label">Seu comentário</label>
            <textarea
              className="review-textarea"
              placeholder="Conte sua experiência..."
              value={newReview.text}
              onChange={(e) => setNewReview({...newReview, text: e.target.value})}
            />
          </div>
          <button className="review-submit">✓ Publicar Avaliação</button>
        </div>
      </div>
    </>
  );
}
