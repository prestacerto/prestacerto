import { Metadata } from 'next';
import { Phase2ProductsDashboard } from '@/components/admin/phase2-products-dashboard';

export const metadata: Metadata = {
  title: 'FASE 2 — Produtos IA | Admin',
  description: '8 produtos de inteligência — Dashboard e gerenciamento',
};

export default function Phase2ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            FASE 2 — 8 Produtos de Inteligência
          </h1>
          <p className="text-gray-600 mt-2">
            Dashboard de gerenciamento de produtos IA para PrestaCerto
          </p>
        </div>

        <Phase2ProductsDashboard />

        {/* Footer com links úteis */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📚 Documentação</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a
                    href="https://assiny.gitbook.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 underline"
                  >
                    Docs Assiny
                  </a>
                </li>
                <li>
                  <a
                    href="/docs/ASSINY_ADMIN_2026-09-11.md"
                    className="hover:text-blue-600 underline"
                  >
                    Admin Assiny
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔗 Links</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a
                    href="https://admin.assiny.com.br/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 underline"
                  >
                    Painel Assiny
                  </a>
                </li>
                <li>
                  <a
                    href="https://pay.assiny.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 underline"
                  >
                    Checkout
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🚀 Deploy</h4>
              <p className="text-gray-600">
                Após adicionar env vars, redeploy em Vercel para ativar os links
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
