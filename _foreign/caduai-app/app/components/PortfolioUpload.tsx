'use client';
import { useState } from 'react';

export default function PortfolioUpload() {
  const [images, setImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop', title: 'Projeto A' },
    { id: 2, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop', title: 'Projeto B' },
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setImages([...images, { id: Date.now(), url, title: file.name.split('.')[0] }]);
        setUploading(false);
      }, 1000);
    }
  };

  const handleDelete = (id: number) => {
    setImages(images.filter(img => img.id !== id));
    if (currentIdx >= images.length - 1) setCurrentIdx(Math.max(0, currentIdx - 1));
  };

  const current = images[currentIdx];

  return (
    <>
      <style>{`
        .portfolio-section {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .portfolio-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1d174f;
        }
        .upload-btn {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .upload-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .upload-input {
          display: none;
        }
        .carousel-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          aspect-ratio: 4/3;
          background: #f5f3f0;
        }
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .carousel-controls {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .carousel-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.9);
          border: 0;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
        }
        .carousel-btn:hover {
          background: white;
          transform: scale(1.1);
        }
        .carousel-info {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
        }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }
        .portfolio-thumb {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }
        .portfolio-thumb.active {
          border-color: #ef4b31;
        }
        .portfolio-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .portfolio-thumb-delete {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 14px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .portfolio-thumb:hover .portfolio-thumb-delete {
          opacity: 1;
        }
      `}</style>

      <div className="portfolio-section">
        <div className="portfolio-header">
          <h2>📸 Portfólio</h2>
          <button className="upload-btn" onClick={() => document.getElementById('portfolio-input')?.click()}>
            {uploading ? 'Enviando...' : '+ Adicionar Foto'}
          </button>
          <input 
            id="portfolio-input"
            type="file" 
            accept="image/*"
            className="upload-input"
            onChange={handleUpload}
          />
        </div>

        {images.length > 0 && (
          <>
            <div className="carousel-container">
              <img src={current.url} alt={current.title} className="carousel-image" />
              <div className="carousel-info">{currentIdx + 1} / {images.length}</div>
              <div className="carousel-controls">
                <button 
                  className="carousel-btn"
                  onClick={() => setCurrentIdx((currentIdx - 1 + images.length) % images.length)}
                >
                  ←
                </button>
                <button 
                  className="carousel-btn"
                  onClick={() => setCurrentIdx((currentIdx + 1) % images.length)}
                >
                  →
                </button>
              </div>
            </div>

            <div className="portfolio-grid">
              {images.map((img, idx) => (
                <div 
                  key={img.id}
                  className={`portfolio-thumb ${idx === currentIdx ? 'active' : ''}`}
                  onClick={() => setCurrentIdx(idx)}
                >
                  <img src={img.url} alt={img.title} />
                  <button 
                    className="portfolio-thumb-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {images.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a8a3b5' }}>
            <p>📸 Nenhuma imagem ainda. Clique em "+ Adicionar Foto" para começar!</p>
          </div>
        )}
      </div>
    </>
  );
}
