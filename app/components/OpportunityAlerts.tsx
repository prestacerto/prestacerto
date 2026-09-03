'use client';
export default function OpportunityAlerts() {
  return (
    <>
      <style>{`
        .alerts-card { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .alerts-title { font-size: 20px; font-weight: 700; color: #1d174f; margin: 0 0 12px; }
        .alerts-desc { font-size: 12px; color: #5d5969; margin: 0 0 20px; }
        .alert-item { padding: 14px; background: #f9f7f3; border-radius: 10px; margin-bottom: 12px; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; }
        .alert-text { font-size: 12px; color: #1d174f; margin: 0; }
        .alert-toggle { width: 40px; height: 24px; background: #ece9e4; border: 0; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .alert-toggle.active { background: #1f9b62; }
      `}</style>

      <div className="alerts-card">
        <p className="alerts-title">🔔 Alertas de Oportunidades</p>
        <p className="alerts-desc">Receba notificações quando surgir um projeto compatível.</p>
        
        <div className="alert-item">
          <p className="alert-text">📍 Projetos em São Paulo</p>
          <button className="alert-toggle active" />
        </div>
        <div className="alert-item">
          <p className="alert-text">💰 Acima de R$ 10k</p>
          <button className="alert-toggle active" />
        </div>
        <div className="alert-item">
          <p className="alert-text">⏱️ Urgentes (até 1 semana)</p>
          <button className="alert-toggle" />
        </div>
        <div className="alert-item">
          <p className="alert-text">💼 Arquitetura & Design</p>
          <button className="alert-toggle active" />
        </div>
      </div>
    </>
  );
}
