'use client';
import { useState } from 'react';

export default function EscrowPaymentIntegrated({ proposalId, amount }: { proposalId?: string; amount?: number }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, amount, paymentMethod, escrow: true })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
      }
    } catch (error) {
      setStatus('error');
    }
    setLoading(false);
  };

  if (status === 'success') {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', background: 'white', borderRadius: '12px', border: '1px solid #e5e0eb', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1f9b62', marginBottom: '12px' }}>Pagamento Confirmado!</h2>
        <p style={{ fontSize: '13px', color: '#5d5969', marginBottom: '20px' }}>
          Seu pagamento de R$ {amount?.toLocaleString('pt-BR')} foi depositado em escrow.
        </p>
        <p style={{ fontSize: '12px', color: '#a8a3b5' }}>O prestador será liberado após conclusão do projeto.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: 'white', borderRadius: '12px', border: '1px solid #e5e0eb', padding: '30px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#1d174f' }}>💳 Pagamento Seguro (Escrow)</h2>
      <p style={{ fontSize: '13px', color: '#5d5969', marginBottom: '30px' }}>Seu dinheiro fica seguro conosco até o projeto estar pronto.</p>

      <div style={{ background: '#f9f8f7', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px' }}>
          <span style={{ color: '#5d5969' }}>Valor do Projeto:</span>
          <span style={{ fontWeight: 700, color: '#1d174f' }}>R$ {amount?.toLocaleString('pt-BR')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px' }}>
          <span style={{ color: '#5d5969' }}>Taxa Prestacerto (5%):</span>
          <span style={{ fontWeight: 700, color: '#1d174f' }}>R$ {Math.round((amount || 0) * 0.05).toLocaleString('pt-BR')}</span>
        </div>
        <div style={{ borderTop: '1px solid #ece9e4', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700 }}>
          <span>Total:</span>
          <span style={{ color: '#ef4b31' }}>R$ {Math.round((amount || 0) * 1.05).toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d174f', display: 'block', marginBottom: '12px' }}>Método de Pagamento</label>
        {['card', 'pix', 'boleto'].map(method => (
          <label key={method} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="payment"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontSize: '13px', color: '#1d174f' }}>
              {method === 'card' && '💳 Cartão de Crédito'}
              {method === 'pix' && '🔐 PIX'}
              {method === 'boleto' && '📄 Boleto'}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: '#ef4b31',
          color: 'white',
          border: 0,
          borderRadius: '8px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '14px',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? '⏳ Processando...' : `💰 Confirmar Pagamento R$ ${Math.round((amount || 0) * 1.05).toLocaleString('pt-BR')}`}
      </button>

      <p style={{ fontSize: '11px', color: '#a8a3b5', marginTop: '16px', textAlign: 'center' }}>
        ✓ Pagamento 100% seguro | ✓ Escrow protegido | ✓ Sem taxas ocultas
      </p>
    </div>
  );
}
