'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function NewPropertyButton() {
  return (
    <Link
      href="/dashboard/imoveis/novo"
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
    >
      <Plus size={20} />
      Publicar Imóvel
    </Link>
  );
}
