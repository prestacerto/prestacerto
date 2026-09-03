'use client';
import { useState, useEffect } from 'react';

type User = { email: string; displayName: string };

export default function IntegratedDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [profile, setProfile] = useState({ completeness: 0 });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/user').then(r => r.json()).then(d => setUser(d.user)),
      fetch('/api/opportunities').then(r => r.json()).then(d => setOpportunities(d.opportunities)),
      fetch('/api/profile').then(r => r.json()).then(d => setProfile(d.profile)),
      fetch('/api/review').then(r => r.json()).then(d => setReviews(d.reviews))
    ]).finally(() => setLoading(false));
  }, []);

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e5e0eb', paddingBottom: '20px' },
    userInfo: { fontSize: '14px', color: '#5d5969' },
    tabs: { display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '2px solid #ece9e4' },
    tabBtn: (active: boolean) => ({ padding: '12px 24px', background: 'none', border: 'none', fontSize: '14px', fontWeight: active ? 700 : 500, color: active ? '#ef4b31' : '#5d5969', borderBottom: active ? '2px solid #ef4b31' : 'none', marginBottom: '-2px', cursor: 'pointer' }),
    card: { background: 'white', border: '1px solid #e5e0eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
    cardTitle: { fontSize: '16px', fontWeight: 700, color: '#1d174f', marginBottom: '8px' },
    progress: { height: '8px', background: '#ece9e4', borderRadius: '4px', marginBottom: '12px', overflow: 'hidden' },
    progressBar: (percent: number) => ({ height: '100%', background: '#ef4b31', width: `${percent}%`, transition: 'width 0.3s' }),
    btn: { background: '#ef4b31', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }
  };

  if (loading) return <div style={styles.container as any}>Carregando...</div>;

  return (
    <div style={styles.container as any}>
      <div style={styles.header as any}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '24px', color: '#1d174f' }}>Olá, {user?.displayName || 'Prestador'}</h1>
          <div style={styles.userInfo as any}>{user?.email}</div>
        </div>
        <a href="/signout-with-chatgpt?return_to=/" style={{ color: '#5d5969', textDecoration: 'underline', fontSize: '13px' }}>Sair</a>
      </div>

      {profile.completeness < 100 && (
        <div style={{ ...styles.card, background: '#fff9f5', borderColor: '#ef4b31' } as any}>
          <div style={styles.cardTitle as any}>📋 Complete seu perfil ({profile.completeness}%)</div>
          <div style={styles.progress as any}>
            <div style={styles.progressBar(profile.completeness) as any} />
          </div>
          <button style={styles.btn as any}>Completar agora</button>
        </div>
      )}

      <div style={styles.tabs as any}>
        {['opportunities', 'projects', 'messages', 'reviews'].map(tab => (
          <button key={tab} style={styles.tabBtn(activeTab === tab) as any} onClick={() => setActiveTab(tab)}>
            {tab === 'opportunities' && '🎯 Oportunidades'}
            {tab === 'projects' && '📁 Meus Projetos'}
            {tab === 'messages' && '💬 Mensagens'}
            {tab === 'reviews' && '⭐ Avaliações'}
          </button>
        ))}
      </div>

      {activeTab === 'opportunities' && (
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#1d174f' }}>Oportunidades Recomendadas</h2>
          {opportunities.map((opp: any) => (
            <div key={opp.id} style={styles.card as any}>
              <div style={styles.cardTitle as any}>{opp.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '14px' }}>
                <div>💰 {opp.budget}</div>
                <div>✨ {opp.matches}% match</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={styles.btn as any}>Ver detalhes</button>
                <button style={{ ...styles.btn, background: 'white', color: '#ef4b31', border: '1px solid #ef4b31' } as any}>Salvar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#1d174f' }}>Suas Avaliações</h2>
          <div style={{ ...styles.card, textAlign: 'center' } as any}>
            <div style={{ fontSize: '32px', color: '#ef4b31', fontWeight: 700 }}>⭐ 4.8</div>
            <div style={{ fontSize: '13px', color: '#5d5969', marginBottom: '16px' }}>{reviews.length} avaliações</div>
            {reviews.map((rev: any) => (
              <div key={rev.id} style={{ textAlign: 'left', padding: '12px', background: '#f9f8f7', borderRadius: '8px', marginBottom: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#1d174f' }}>{rev.author}</div>
                <div style={{ fontSize: '12px', color: '#5d5969' }}>{rev.comment}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
