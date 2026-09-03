'use client';
import { useState } from 'react';

export default function ProfileUploadIntegrated() {
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, skills: skills.split(',').map(s => s.trim()), hourlyRate })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setBio('');
        setSkills('');
        setHourlyRate('');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: 'white', borderRadius: '12px', border: '1px solid #e5e0eb', padding: '30px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#1d174f' }}>👤 Complete seu Perfil</h2>
      <p style={{ fontSize: '13px', color: '#5d5969', marginBottom: '30px' }}>Quanto mais completo, mais projetos você receberá</p>

      {success && (
        <div style={{ background: '#e8f5f0', border: '1px solid #1f9b62', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#1f9b62', fontSize: '13px' }}>
          ✓ Perfil atualizado com sucesso!
        </div>
      )}

      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d174f', display: 'block', marginBottom: '8px' }}>Sobre você</label>
          <textarea
            placeholder="Conte um pouco sobre sua experiência..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ece9e4', fontSize: '13px', fontFamily: 'inherit', minHeight: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d174f', display: 'block', marginBottom: '8px' }}>Skills (separadas por vírgula)</label>
          <input
            type="text"
            placeholder="React, Node.js, UI Design, Marketing..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ece9e4', fontSize: '13px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d174f', display: 'block', marginBottom: '8px' }}>Valor/hora (R$)</label>
          <input
            type="number"
            placeholder="150"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ece9e4', fontSize: '13px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#ef4b31', color: 'white', border: 0, borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
        >
          {loading ? '⏳ Salvando...' : '✓ Salvar Perfil'}
        </button>
      </form>
    </div>
  );
}
