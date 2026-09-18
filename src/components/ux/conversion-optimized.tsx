'use client';

import { ReactNode } from 'react';

export function TrustBadge() {
  return <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">✅ Verificado</div>;
}

export function CTAButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all hover:scale-105">
      {children}
    </button>
  );
}

export function SocialProof({ count, text }: { count: number; text: string }) {
  return <div className="text-center text-sm font-semibold text-green-700">✨ {count.toLocaleString()} {text}</div>;
}

export function TestimonialCard({ name, role, text }: any) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
      <p className="font-bold text-sm">{name}</p>
      <p className="text-xs text-gray-500">{role}</p>
      <p className="text-sm text-gray-700 italic mt-2">"{text}"</p>
      <div className="flex gap-1 mt-3">⭐⭐⭐⭐⭐</div>
    </div>
  );
}

export function ScarcityBadge({ items }: { items: number }) {
  return <div className="text-sm font-semibold text-red-700 animate-pulse">🔥 Apenas {items} vagas!</div>;
}
