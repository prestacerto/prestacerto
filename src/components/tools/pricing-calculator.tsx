'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { estimateProjectPrice, type PricingInput } from '@/lib/pricing-estimate';

const fields: {key:keyof PricingInput;label:string;help:string;min:number;max?:number}[]=[
 {key:'monthlyCosts',label:'Custos mensais (R$)',help:'Ferramentas, internet e despesas do trabalho.',min:0},
 {key:'monthlyIncome',label:'Renda mensal desejada (R$)',help:'Quanto você quer receber pelo seu trabalho.',min:0},
 {key:'billableHours',label:'Horas faturáveis por mês',help:'Conte apenas as horas que você consegue vender.',min:1},
 {key:'projectHours',label:'Horas previstas para o projeto',help:'Inclua planejamento, execução e revisões.',min:1},
 {key:'reservePercent',label:'Reserva para impostos e taxas (%)',help:'Informe o percentual adequado ao seu caso.',min:0,max:99},
];
const brl=(v:number)=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function PricingCalculator(){
 const [values,setValues]=useState<PricingInput>({monthlyCosts:3000,monthlyIncome:5000,billableHours:120,projectHours:80,reservePercent:0});
 const estimate=estimateProjectPrice(values);
 return <section className="border-y border-blue-100 bg-white px-5 py-14 text-slate-900 sm:py-20">
 <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
 <div><span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"><Calculator className="size-4"/> Ferramenta gratuita</span><h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Seu preço começa<br/>pelos seus números.</h2><p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Estime o valor por hora e por projeto com base nos seus custos, na renda desejada e no tempo de trabalho.</p><p className="mt-4 max-w-lg text-sm leading-6 text-slate-500">Esta é uma base de planejamento. Não é uma previsão de mercado nem uma garantia de contratação. A reserva de impostos e taxas é informada por você.</p><Link href="/register?role=freelancer" className="mt-7 inline-flex items-center gap-3 font-semibold text-blue-700">Criar meu perfil gratuito <ArrowUpRight className="size-4"/></Link></div>
 <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-7"><div className="grid gap-5 sm:grid-cols-2">{fields.map(field=><label key={field.key} htmlFor={`pricing-${field.key}`} className="text-sm font-semibold">{field.label}<Input className="mt-2 h-11 bg-white text-base" id={`pricing-${field.key}`} type="number" min={field.min} max={field.max} step="any" value={Number.isNaN(values[field.key])?'':values[field.key]} onChange={event=>setValues({...values,[field.key]:event.target.value===''?NaN:Number(event.target.value)})}/><span className="mt-2 block text-sm font-normal leading-5 text-slate-500">{field.help}</span></label>)}</div>
 <div aria-live="polite" className="mt-7 rounded-xl bg-blue-600 p-5 text-white">{estimate?<><p className="text-sm text-blue-100">BASE ESTIMADA POR HORA</p><p className="mt-2 text-4xl font-semibold tracking-tight">{brl(estimate.hourly)}</p><div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-white/20 pt-4"><span>Projeto de {values.projectHours} horas</span><strong>{brl(estimate.project)}</strong></div></>:<p>Preencha valores válidos. As horas precisam ser maiores que zero e a reserva deve ser menor que 100%.</p>}</div></div></div>
 </section>;
}
