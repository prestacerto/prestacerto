'use client';
import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import ThreePillars from './components/ThreePillars';
import CategoriesSection from './components/CategoriesSection';
import DiscoverSection from './components/DiscoverSection';
import BriefingAIIntegrated from './components/BriefingAI-Integrated';
import PricingCalculator from './components/PricingCalculator';
import StartingPoint from './components/StartingPoint';
import FAQNarrative from './components/FAQNarrative';
import FinalCTA from './components/FinalCTA';

export default function Home() {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1d174f; background: white; }

        header {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 40px;
          align-items: center;
          padding: 20px 40px;
          background: white;
          border-bottom: 1px solid #e5e0eb;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        @media (max-width: 768px) {
          header {
            grid-template-columns: 1fr auto;
            gap: 16px;
            padding: 16px 24px;
          }
          header nav { display: none; }
        }

        .brand {
          font-size: 18px;
          font-weight: 900;
          color: #1d174f;
          text-decoration: none;
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .brand-mark {
          width: 28px;
          height: 28px;
          background: #0066ff;
          border-radius: 6px;
          display: grid;
          place-items: center;
          color: white;
          font-weight: 900;
          font-size: 14px;
        }

        nav {
          display: flex;
          gap: 32px;
        }

        nav a {
          font-size: 13px;
          font-weight: 600;
          color: #5d5969;
          text-decoration: none;
          transition: color 0.2s;
        }

        nav a:hover { color: #0066ff; }

        .header-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .portal-link {
          font-size: 13px;
          font-weight: 700;
          color: #0066ff;
          text-decoration: none;
          transition: color 0.2s;
        }

        .portal-link:hover { color: #0052cc; }

        .btn-header {
          background: #0066ff;
          color: white;
          border: 0;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .btn-header:hover { background: #0052cc; }

        main { background: white; }
      `}</style>

      <header>
        <a href="/" className="brand">
          <span className="brand-mark">C</span>
          <span>Prestacerto</span>
        </a>
        <nav>
          <a href="#buscar">Buscar prestadores</a>
          <a href="#como">Como funciona</a>
          <a href="#certo">Certo AI</a>
          <a href="#comunidade">Comunidade</a>
          <a href="#planos">Planos</a>
        </nav>
        <div className="header-actions">
          <a href="/dashboard" className="portal-link">Entrar</a>
          <a href="/signup" className="btn-header">Cadastrar grátis</a>
        </div>
      </header>

      <main>
        <HeroSection />
        <ThreePillars />
        <CategoriesSection />
        <DiscoverSection />
        <section style={{ background: '#f9f8f7', padding: '80px 40px' }}>
          <BriefingAIIntegrated user={user} />
        </section>
        <PricingCalculator />
        <StartingPoint />
        <FAQNarrative />
        <FinalCTA />
      </main>
    </>
  );
}
