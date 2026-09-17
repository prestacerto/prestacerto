import { getPageMetadata } from '@/lib/seo/metadata';
import { PricingCalculator } from '@/components/tools/pricing-calculator';
export const metadata = getPageMetadata('Calculadora de precificação freelancer', 'Calcule uma base de preço por hora e por projeto a partir dos seus custos e horas de trabalho.', '/ferramentas/calculadora');
export default function Page(){return <div><h1 className="sr-only">Certo Preço</h1><PricingCalculator/></div>}
