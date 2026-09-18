'use client';
import { useState, useEffect } from 'react';

export default function MasterDashboard() {
  const [user, setUser] = useState<any>(null);
  const [section, setSection] = useState('home');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/user').then(r => r.json()),
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/opportunities').then(r => r.json()),
      fetch('/api/notifications').then(r => r.json()),
      fetch('/api/matches').then(r => r.json()),
      fetch('/api/review').then(r => r.json())
    ]).then(([user, profile, opps, notif, matches, reviews]) => {
      setUser(user.user);
      setData({ profile, opportunities: opps.opportunities, notifications: notif.notifications, matches: matches.matches, reviews: reviews.reviews });
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#5d5969' }}>Carregando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f7' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e0eb', padding: '16px 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '20px', fontWeight: 700, color: '#1d174f' }}>Prestacerto</h1>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: '20px' }}>🔔</span>
              {data.notifications?.length > 0 && (
                <div style={{ position: 'absolute', top: '-4px', right: '-8px', background: '#ef4b31', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                  {data.notifications.filter((n: any) => !n.read).length}
                </div>
              )}
            </div>
            <div style={{ fontSize: '13px' }}>
              <div style={{ fontWeight: 600, color: '#1d174f' }}>{user?.displayName || 'Usuário'}</div>
              <div style={{ fontSize: '11px', color: '#a8a3b5' }}>{user?.email}</div>
            </div>
            <a href="/signout-with-chatgpt?return_to=/" style={{ fontSize: '13px', color: '#5d5969', textDecoration: 'underline' }}>Sair</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '30px' }}>
          {[
            { id: 'home', label: '🏠 Home', icon: '🏠' },
            { id: 'opportunities', label: '🎯 Oportunidades', icon: '🎯' },
            { id: 'profile', label: '👤 Perfil', icon: '👤' },
            { id: 'messages', label: '💬 Mensagens', icon: '💬' },
            { id: 'reviews', label: '⭐ Avaliações', icon: '⭐' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id)}
              style={{
                padding: '12px 16px',
                background: section === tab.id ? '#ef4b31' : 'white',
                color: section === tab.id ? 'white' : '#1d174f',
                border: section === tab.id ? 'none' : '1px solid #e5e0eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: section === tab.id ? 700 : 600,
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {section === 'home' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {/* Profile Completeness */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e0eb' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#1d174f' }}>📋 Perfil</h3>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4b31', marginBottom: '8px' }}>{data.profile?.completeness}%</div>
              <div style={{ height: '4px', background: '#ece9e4', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ height: '100%', background: '#ef4b31', width: `${data.profile?.completeness}%` }} />
              </div>
              <button style={{ width: '100%', padding: '8px', background: '#0066ff', color: 'white', border: 0, borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Completar
              </button>
            </div>

            {/* Smart Matches */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e0eb' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#1d174f' }}>✨ Matches</h3>
              {data.matches?.slice(0, 2).map((m: any) => (
                <div key={m.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
                  <div style={{ color: '#1d174f', fontWeight: 600 }}>{m.title}</div>
                  <div style={{ color: '#ef4b31', fontWeight: 700 }}>{m.match}% match</div>
                </div>
              ))}
            </div>

            {/* Ratings */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e0eb' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#1d174f' }}>⭐ Avaliação</h3>
              <div style={{ fontSize: '32px', color: '#ef4b31', fontWeight: 700, marginBottom: '8px' }}>4.8</div>
              <div style={{ fontSize: '12px', color: '#5d5969' }}>com {data.reviews?.length || 0} avaliações</div>
            </div>
          </div>
        )}

        {section === 'opportunities' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#1d174f' }}>Oportunidades para você</h2>
            {data.opportunities?.map((opp: any) => (
              <div key={opp.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e0eb', marginBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1d174f', marginBottom: '8px' }}>{opp.title}</div>
                    <div style={{ fontSize: '13px', color: '#5d5969', marginBottom: '12px' }}>{opp.budget}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4b31' }}>{opp.matches}%</div>
                    <div style={{ fontSize: '11px', color: '#5d5969' }}>match</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, padding: '10px', background: '#ef4b31', color: 'white', border: 0, borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Enviar Proposta
                  </button>
                  <button style={{ flex: 1, padding: '10px', background: 'white', color: '#ef4b31', border: '1px solid #ef4b31', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Salvar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {section === 'profile' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #e5e0eb', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#1d174f' }}>Seu Perfil</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d174f', display: 'block', marginBottom: '8px' }}>Nome</label>
              <input type="text" defaultValue={user?.displayName} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ece9e4', fontSize: '13px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d174f', display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" defaultValue={user?.email} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ece9e4', fontSize: '13px', background: '#f9f8f7', color: '#a8a3b5' }} />
            </div>
            <button style={{ width: '100%', padding: '12px', background: '#ef4b31', color: 'white', border: 0, borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
              Salvar Alterações
            </button>
          </div>
        )}

        {section === 'reviews' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#1d174f' }}>Suas Avaliações</h2>
            <div style={{ background: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #e5e0eb', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', color: '#ef4b31', fontWeight: 700, marginBottom: '8px' }}>4.8 ⭐</div>
              <div style={{ fontSize: '13px', color: '#5d5969' }}>{data.reviews?.length || 0} avaliações</div>
            </div>
            {data.reviews?.map((rev: any) => (
              <div key={rev.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e0eb', marginBottom: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d174f', marginBottom: '4px' }}>{rev.author}</div>
                <div style={{ fontSize: '11px', color: '#5d5969', marginBottom: '8px' }}>{rev.date}</div>
                <div style={{ fontSize: '13px', color: '#5d5969' }}>{rev.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
