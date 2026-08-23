'use client';

import { useState } from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';

interface ContactSellerProps {
  propertyId: string;
}

export default function ContactSeller({ propertyId }: ContactSellerProps) {
  const [contactMethod, setContactMethod] = useState<'phone' | 'whatsapp' | 'email'>('whatsapp');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const seller = {
    name: 'João Silva',
    role: 'Corretor de Imóveis',
    phone: '11 98765-4321',
    email: 'joao@seuimovel.com.br',
    responseTime: 'Geralmente responde em 1 hora',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Seller info */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex gap-4 mb-4">
          <img
            src={seller.image}
            alt={seller.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">{seller.name}</h3>
            <p className="text-gray-600">{seller.role}</p>
            <p className="text-sm text-green-600 mt-1">✓ {seller.responseTime}</p>
          </div>
        </div>
      </div>

      {/* Contact form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Sua mensagem..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
        />

        {/* Contact method buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setContactMethod('whatsapp')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              contactMethod === 'whatsapp'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <MessageSquare size={20} />
            Enviar via WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setContactMethod('phone')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              contactMethod === 'phone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Phone size={20} />
            {seller.phone}
          </button>
          <button
            type="button"
            onClick={() => setContactMethod('email')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              contactMethod === 'email'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Mail size={20} />
            Enviar email
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
        >
          Enviar Mensagem
        </button>
      </form>

      {submitted && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm">
          ✓ Mensagem enviada com sucesso!
        </div>
      )}

      {/* Privacy notice */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Seus dados estão protegidos. Leia nossa{' '}
        <a href="#" className="text-blue-600 hover:underline">
          política de privacidade
        </a>
      </p>
    </div>
  );
}
