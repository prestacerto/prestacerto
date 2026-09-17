'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';

export function ReferralCard({ code }: { code: string }) {
  return (
    <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <CardHeader>
        <CardTitle>Indique e Ganhe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm opacity-90">Seu código de indicação:</p>
          <div className="flex gap-2 mt-2">
            <code className="bg-white/20 px-4 py-2 rounded flex-1">{code}</code>
            <Button size="sm" className="bg-white text-green-600" onClick={() => navigator.clipboard.writeText(code)}>
              <Copy size={16} /> Copiar
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-75">Ganho por freelancer</p>
            <p className="text-2xl font-bold">R$ 50</p>
          </div>
          <div>
            <p className="opacity-75">Ganho por client</p>
            <p className="text-2xl font-bold">R$ 200</p>
          </div>
        </div>
        <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
          <Share2 size={16} /> Compartilhar
        </Button>
      </CardContent>
    </Card>
  );
}
