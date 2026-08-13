import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Isolado numa função à parte de propósito: o lint de pureza reclama de
// Date.now() direto dentro de um componente, mas Server Components
// legitimamente precisam da hora real da requisição.
export function daysUntil(dateIso: string): number {
  return Math.max(1, Math.ceil((new Date(dateIso).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
