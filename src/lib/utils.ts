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
