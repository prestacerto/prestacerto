"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SuccessStoryProps {
  id: string;
  title: string;
  freelancer_name: string;
  before_price: number;
  after_price: number;
  before_month: string;
  after_month: string;
  featured?: boolean;
}

export function SuccessStoryCard({
  id,
  title,
  freelancer_name,
  before_price,
  after_price,
  before_month,
  after_month,
  featured,
}: SuccessStoryProps) {
  const growth = ((after_price - before_price) / before_price) * 100;

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${featured ? 'ring-2 ring-yellow-400' : ''}`}>
      {featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-1 text-xs font-bold text-white">
          ⭐ HISTÓRIA EM DESTAQUE
        </div>
      )}
      <CardContent className="p-6">
        <Link href={`/aprenda/historias/${id}`} className="group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{freelancer_name}</p>
            </div>
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg px-2.5 py-1">
              <TrendingUp className="size-3.5" />
              <span className="text-xs font-bold">+{Math.round(growth)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">Antes ({before_month})</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                R$ {before_price.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 text-center">
              <p className="text-xs text-green-700 dark:text-green-300">Depois ({after_month})</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-1">
                R$ {after_price.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Clique pra ler a história completa →
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
