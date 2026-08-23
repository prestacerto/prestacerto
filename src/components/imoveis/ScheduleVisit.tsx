'use client';

import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleVisitProps {
  propertyId: string;
}

export default function ScheduleVisit({ propertyId }: ScheduleVisitProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDate('');
      setTime('');
      setName('');
      setPhone('');
    }, 3000);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Agendar uma Visita</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Seu Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
            placeholder="João Silva"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Telefone/WhatsApp</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
            placeholder="11 98765-4321"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
            <Calendar size={18} />
            Data da Visita
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={minDate}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
            <Clock size={18} />
            Horário Preferido
          </label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-600"
          >
            <option value="">Selecione um horário</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
        >
          Solicitar Agendamento
        </button>
      </form>

      {submitted && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          ✓ Agendamento solicitado! O corretor entrará em contato em breve.
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Dica:</strong> Tenha disponibilidade também para visitas virtuais!
        </p>
      </div>
    </div>
  );
}
