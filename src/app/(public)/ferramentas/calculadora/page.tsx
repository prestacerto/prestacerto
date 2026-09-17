import { getPageMetadata } from '@/lib/seo/metadata';
import { PricingCalculator } from '@/components/tools/pricing-calculator';
export const metadata = getPageMetadata('Calculadora de precificação freelancer', 'Calcule seu preço por hora e por projeto com base nos custos, na renda desejada e nas horas de trabalho. Calculadora gratuita, sem cadastro.', '/ferramentas/calculadora');
export default function Page(){return <div><h1 className="sr-only">Calculadora gratuita de precificação freelancer</h1><PricingCalculator/></div>}
