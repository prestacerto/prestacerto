import { ProductDashboard } from '@/components/product-dashboard';
import { getProductById } from '@/lib/community-products-data';

export const metadata = {
  title: 'Candidato - PrestaCerto',
  description: 'Procure por oportunidades',
};

export default function CandidatoPage() {
  const product = getProductById('candidato');
  if (!product) return null;

  return (
    <ProductDashboard product={product}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Vagas recomendadas para você</h3>
          <button className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 font-semibold transition-colors mb-4">
            Explorar vagas
          </button>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
              <h4 className="font-semibold text-slate-900">Desenvolvedor Full Stack</h4>
              <p className="text-sm text-slate-600 mt-1">Startup de SaaS • R$ 6.000 - R$ 8.000 / mês</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
              <h4 className="font-semibold text-slate-900">Product Manager</h4>
              <p className="text-sm text-slate-600 mt-1">Fintech • R$ 8.000 - R$ 12.000 / mês</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Inscrições enviadas</h3>
          <p className="text-sm text-slate-600 mb-4">Acompanhe suas candidaturas aqui</p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">Nenhuma inscrição ainda</p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-2">Completar seu perfil</h3>
          <p className="text-sm text-slate-700 mb-4">Quanto mais completo seu perfil, mais vagas você receberá.</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-slate-700">Experiência profissional</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-slate-700">Certificados e cursos</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-slate-700">Portfólio de trabalhos</span>
            </div>
          </div>
        </div>
      </div>
    </ProductDashboard>
  );
}
