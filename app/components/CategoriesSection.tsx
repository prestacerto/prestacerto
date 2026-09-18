'use client';
import { useState } from 'react';

export default function CategoriesSection() {
  const categories = [
    { icon: '💻', title: 'Tecnologia', desc: 'Sites, sistemas, apps e automações' },
    { icon: '🎨', title: 'Design & conteúdo', desc: 'Identidade visual, UX/UI e vídeo' },
    { icon: '📱', title: 'Marketing', desc: 'Tráfego, redes e estratégia' },
    { icon: '🏠', title: 'Casa & manutenção', desc: 'Reparos, montagem e cuidado' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <style>{`
        .categories { background: linear-gradient(180deg, #f9f7f3 0%, white 100%); padding: 80px 40px; }
        @media (max-width: 768px) { .categories { padding: 40px 24px; } }
        
        .categories-header { max-width: 1200px; margin: 0 auto 60px; }
        .categories-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #0066ff; text-transform: uppercase; margin: 0 0 16px; }
        .categories-title { font-size: 44px; font-weight: 900; color: #1d174f; margin: 0; line-height: 1.2; }
        .categories-subtitle { font-size: 16px; color: #5d5969; margin: 16px 0 0; }
        
        .categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) { .categories-grid { grid-template-columns: 1fr; } }
        
        .category-card { padding: 40px; background: white; border-radius: 16px; cursor: pointer; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid transparent; }
        .category-card:hover { transform: translateY(-8px); border-color: #0066ff; box-shadow: 0 24px 48px rgba(0, 102, 255, 0.12); }
        .category-card.active { background: #0066ff; }
        
        .category-icon { font-size: 40px; margin-bottom: 12px; }
        .category-title { font-size: 20px; font-weight: 700; color: #1d174f; margin: 0 0 8px; }
        .category-card.active .category-title { color: white; }
        .category-desc { font-size: 14px; color: #5d5969; margin: 0; line-height: 1.6; }
        .category-card.active .category-desc { color: rgba(255,255,255,0.9); }
        
        .view-all { text-align: center; margin-top: 40px; }
        .view-all a { color: #0066ff; text-decoration: none; font-weight: 700; font-size: 14px; }
      `}</style>

      <section className="categories">
        <div className="categories-header">
          <p className="categories-label">Uma boa solução começa com o caminho certo</p>
          <h2 className="categories-title">Escolha uma área</h2>
          <p className="categories-subtitle">compare possibilidades e encontre alguém que entende o que você quer tirar do papel.</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className={`category-card ${activeIndex === i ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3 className="category-title">{cat.title}</h3>
              <p className="category-desc">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="view-all">
          <a href="#categories">Ver todas as áreas →</a>
        </div>
      </section>
    </>
  );
}
