'use client';
export default function AdminDashboard() {
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>🎛️ Painel Administrativo</h1>
          <p>Acompanhamento geral da plataforma</p>
        </div>
        <a href="/signout-with-chatgpt?return_to=/" className="logout-btn">Sair</a>
      </header>

      <section className="admin-grid">
        <article className="admin-card">
          <span className="admin-icon">📊</span>
          <p>Total de Leads</p>
          <strong>2,458</strong>
          <small>+12% vs. mês anterior</small>
        </article>
        <article className="admin-card">
          <span className="admin-icon">👥</span>
          <p>Usuários Ativos</p>
          <strong>342</strong>
          <small>+8% vs. mês anterior</small>
        </article>
        <article className="admin-card">
          <span className="admin-icon">💰</span>
          <p>Receita (MRR)</p>
          <strong>R$ 45.8K</strong>
          <small>+24% vs. mês anterior</small>
        </article>
        <article className="admin-card">
          <span className="admin-icon">🎯</span>
          <p>Taxa de Conversão</p>
          <strong>31%</strong>
          <small>+4.2pp vs. mês anterior</small>
        </article>
      </section>

      <section className="admin-grid-2">
        <article className="admin-panel">
          <header>
            <h2>Usuários Mais Ativos</h2>
            <a href="#">Ver todos →</a>
          </header>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Leads</th>
                <th>Receita</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>João Silva</strong><br/><small>Imobiliário</small></td>
                <td>145</td>
                <td>R$ 12.5K</td>
                <td><span className="status active">Ativo</span></td>
              </tr>
              <tr>
                <td><strong>Maria Santos</strong><br/><small>Arquitetura</small></td>
                <td>128</td>
                <td>R$ 9.8K</td>
                <td><span className="status active">Ativo</span></td>
              </tr>
              <tr>
                <td><strong>Carlos Oliveira</strong><br/><small>Engenharia</small></td>
                <td>98</td>
                <td>R$ 7.2K</td>
                <td><span className="status active">Ativo</span></td>
              </tr>
              <tr>
                <td><strong>Ana Ferreira</strong><br/><small>Design</small></td>
                <td>76</td>
                <td>R$ 5.4K</td>
                <td><span className="status idle">Inativo</span></td>
              </tr>
            </tbody>
          </table>
        </article>

        <article className="admin-panel">
          <header>
            <h2>Planos por Tipo</h2>
            <a href="#">Gerenciar →</a>
          </header>
          <div className="plan-breakdown">
            <div className="plan-item">
              <div>
                <p>Plano Básico</p>
                <small>R$ 49/mês</small>
              </div>
              <strong>156 usuários</strong>
            </div>
            <div className="plan-item">
              <div>
                <p>Plano Pro</p>
                <small>R$ 99/mês</small>
              </div>
              <strong>124 usuários</strong>
            </div>
            <div className="plan-item">
              <div>
                <p>Plano Premium</p>
                <small>R$ 199/mês</small>
              </div>
              <strong>62 usuários</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="admin-grid-2">
        <article className="admin-panel">
          <header>
            <h2>Atividades Recentes</h2>
            <a href="#">Ver histórico →</a>
          </header>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🚀</span>
              <div>
                <p><strong>João Silva</strong> publicou novo projeto</p>
                <small>há 2 horas</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💳</span>
              <div>
                <p><strong>Maria Santos</strong> fez upgrade para Pro</p>
                <small>há 5 horas</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✨</span>
              <div>
                <p><strong>Carlos Oliveira</strong> conectou Certo AI</p>
                <small>há 8 horas</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📊</span>
              <div>
                <p><strong>Ana Ferreira</strong> visualizou relatório</p>
                <small>há 12 horas</small>
              </div>
            </div>
          </div>
        </article>

        <article className="admin-panel">
          <header>
            <h2>Funcionalidades Premium</h2>
            <a href="#">Gerenciar →</a>
          </header>
          <div className="feature-stats">
            <div className="feature-item">
              <div>
                <p>Certo AI</p>
                <small>Inteligência artificial</small>
              </div>
              <div className="stat">
                <strong>87</strong>
                <small>ativos</small>
              </div>
            </div>
            <div className="feature-item">
              <div>
                <p>Certo Currículo</p>
                <small>Gestão de currículos</small>
              </div>
              <div className="stat">
                <strong>64</strong>
                <small>ativos</small>
              </div>
            </div>
            <div className="feature-item">
              <div>
                <p>Certo Preço</p>
                <small>Precificação inteligente</small>
              </div>
              <div className="stat">
                <strong>52</strong>
                <small>ativos</small>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
