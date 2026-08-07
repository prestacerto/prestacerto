"use client";

import { Shield, Lock } from "lucide-react";

export function SecurityBadge() {
  return (
    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
      <div className="flex-shrink-0">
        <Shield className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-emerald-900">
          🔒 Sua compra está segura
        </p>
        <p className="text-xs text-emerald-700 mt-0.5">
          Mercado Pago protege 100% da sua transação com encriptação SSL
        </p>
      </div>
      <Lock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
    </div>
  );
}

/**
 * Inline version for checkout button area
 */
export function SecurityBadgeInline() {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
      <Lock className="h-3 w-3 text-green-600" />
      <span>Pagamento seguro com Mercado Pago</span>
      <span className="text-green-600 font-semibold">✓ Verificado</span>
    </div>
  );
}
