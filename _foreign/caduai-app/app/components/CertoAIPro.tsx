'use client';
export default function CertoAIPro() {
  return (
    <>
      <style>{`
        .ai-card { background: linear-gradient(135deg, #1f9b62 0%, #17b26a 100%); color: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(31, 155, 98, 0.2); }
        .ai-title { font-size: 16px; font-weight: 700; margin: 0 0 12px; }
        .ai-desc { font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 16px; line-height: 1.5; }
        .ai-features { list-style: none; padding: 0; margin: 0 0 16px; }
        .ai-features li { font-size: 11px; margin-bottom: 6px; padding-left: 18px; position: relative; }
        .ai-features li:before { content: '✓'; position: absolute; left: 0; font-weight: 700; }
        .ai-btn { width: 100%; padding: 12px; background: white; color: #1f9b62; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; }
      `}</style>
      <div className="ai-card">
        <p className="ai-title">🤖 Certo AI Avançado</p>
        <p className="ai-desc">Ferramentas de IA para melhorar seu perfil, propostas e captação.</p>
        <ul className="ai-features">
          <li>Gerador de Bio Profissional</li>
          <li>Escritor de Propostas Inteligente</li>
          <li>Análise de Escopo Automática</li>
          <li>Sugestões de Preço</li>
          <li>Descrição Otimizada</li>
        </ul>
        <button className="ai-btn">Ativar Agora - R$ 29/mês</button>
      </div>
    </>
  );
}
