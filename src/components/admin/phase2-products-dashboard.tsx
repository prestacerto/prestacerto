'use client';

import { useEffect, useState } from 'react';
import type { Phase2Product } from '@/lib/phase2-products';

interface Phase2ProductWithStatus extends Phase2Product {
  checkoutUrl?: string;
  envVarName?: string;
  envVarValue?: string;
}

interface ApiResponse {
  status: string;
  count: number;
  products: Phase2ProductWithStatus[];
  summary: {
    monthly: number;
    oneTime: number;
    estimatedMRR: string;
    totalOneTime: string;
  };
}

export function Phase2ProductsDashboard() {
  const [products, setProducts] = useState<Phase2ProductWithStatus[]>([]);
  const [summary, setSummary] = useState<ApiResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/phase2/products')
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setProducts(data.products);
        setSummary(data.summary);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sumário */}
      {summary && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Produtos Mensais</p>
            <p className="text-2xl font-bold text-blue-600">{summary.monthly}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Valor Único</p>
            <p className="text-2xl font-bold text-green-600">{summary.oneTime}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">MRR Estimado</p>
            <p className="text-2xl font-bold text-purple-600">R$ {summary.estimatedMRR}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">One-time Total</p>
            <p className="text-2xl font-bold text-orange-600">R$ {summary.totalOneTime}</p>
          </div>
        </div>
      )}

      {/* Tabela de Produtos */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-3 text-left text-sm font-semibold">Produto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Preço</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Env Var</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{product.icon}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold">
                    R$ {product.price.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      product.billingType === 'monthly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {product.billingType === 'monthly' ? 'Mensal' : 'Única'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.checkoutUrl ? (
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                      ✓ Ativo
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                      ⏳ Pendente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                    {product.envVarName}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instruções de Setup */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">
          ⚙️ Próximos Passos para Ativar Links
        </h3>
        <ol className="space-y-2 text-sm text-blue-800">
          <li>
            <strong>1.</strong> Acesse{' '}
            <a
              href="https://admin.assiny.com.br/login"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              admin.assiny.com.br
            </a>
          </li>
          <li>
            <strong>2.</strong> Vá para Produtos → Criar Novo Produto
          </li>
          <li>
            <strong>3.</strong> Para cada produto acima (8 total), crie uma oferta com:
            <ul className="ml-6 mt-1 space-y-1">
              <li>
                • Nome: conforme tabela acima
              </li>
              <li>
                • Preço: R$ conforme tabela
              </li>
              <li>
                • Recorrência: Mensal ou Única (conforme "Tipo")
              </li>
            </ul>
          </li>
          <li>
            <strong>4.</strong> Copie o link de checkout (formato: https://pay.assiny.com.br/ba2d4a/node/xyz123)
          </li>
          <li>
            <strong>5.</strong> Cole em{' '}
            <code className="bg-white px-2 py-1 rounded">.env.local</code> com o nome da env var
          </li>
          <li>
            <strong>6.</strong> Redeploy a aplicação
          </li>
        </ol>
      </div>

      {/* Lista de Env Vars para Copiar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          📋 Env Vars para .env.local
        </h3>
        <pre className="bg-white border border-gray-200 rounded p-4 text-xs overflow-x-auto">
          {products
            .map(
              (p) =>
                `# ${p.name}\nNEXT_PUBLIC_ASSINIFY_${p.id.toUpperCase().replace(/-/g, '_')}=https://pay.assiny.com.br/ACCOUNT_ID/node/PRODUCT_ID`
            )
            .join('\n\n')}
        </pre>
      </div>
    </div>
  );
}
