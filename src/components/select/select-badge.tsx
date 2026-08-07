"use client";

import { Award, Zap, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SelectBadgeProps {
  status: "active" | "expired" | "pending";
  testType: "dev" | "design" | "copywriting" | "marketing" | "general";
  score?: number;
  size?: "sm" | "md" | "lg";
}

/**
 * Badge visual: "PrestaCerto Select" — Verified quality via real test
 * Only shows if freelancer PASSED test (not just identity verified)
 */
export function SelectBadge({ status, testType, score, size = "md" } : SelectBadgeProps) {
  if (status !== "active") return null;

  const testLabels = {
    dev: "Desenvolvimento",
    design: "Design",
    copywriting: "Copywriting",
    marketing: "Marketing",
    general: "Geral",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      {/* Visual indicator */}
      <div className="relative">
        <Award className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-500`} />
      </div>

      {/* Badge text */}
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-slate-900">
          ✓ PrestaCerto Select
        </span>
        <span className="text-xs text-slate-600">
          Teste passado: {testLabels[testType]}
          {score && ` (${Math.round(score)}%)`}
        </span>
      </div>
    </div>
  );
}

/**
 * Banner: Display on profile + search results
 */
export function SelectBanner({ testType, score }: Omit<SelectBadgeProps, 'status'> & { status?: 'active' }) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900 mb-1">
            ✓ Verificado por Teste
          </h4>
          <p className="text-sm text-slate-700">
            Esse freelancer passou pelo teste de qualidade da PrestaCerto em {testType}.
            <strong> Clientes pagam premium por esse filtro.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Profile card enhancement
 */
export function FreelancerCardWithSelect({
  name,
  avatar,
  rating,
  selectStatus,
  testType,
  testScore,
}: {
  name: string;
  avatar: string;
  rating: number;
  selectStatus?: "active" | null;
  testType?: string;
  testScore?: number;
}) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold">{name}</h3>
        {selectStatus === "active" && (
          <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
            SELECT ✓
          </div>
        )}
      </div>

      {selectStatus === "active" && (
        <SelectBadge
          status="active"
          testType={(testType as SelectBadgeProps["testType"]) || "general"}
          score={testScore}
          size="sm"
        />
      )}

      <div className="mt-3 flex items-center gap-2">
        <div className="text-yellow-400">⭐ {rating}</div>
        <span className="text-xs text-slate-600">Verificado</span>
      </div>
    </div>
  );
}
