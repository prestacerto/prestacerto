"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Navegação por teclado numa lista de cards (ex: propostas recebidas).
 * ↑/↓ ou j/k move o foco, Enter aciona a ação primária do card focado
 * (botão marcado com data-kbd-primary), "c" abre a ação secundária
 * (link marcado com data-kbd-secondary).
 */
export function KeyboardNavList({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    function getItems(): HTMLElement[] {
      return Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>("[data-kbd-item]") ?? []
      );
    }

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const items = getItems();
      if (items.length === 0) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        const active = items[activeIndex];
        active?.querySelector<HTMLElement>("[data-kbd-primary] button")?.click();
      } else if (e.key === "c") {
        const active = items[activeIndex];
        active?.querySelector<HTMLAnchorElement>("[data-kbd-secondary]")?.click();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  useEffect(() => {
    const items = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>("[data-kbd-item]") ?? []
    );
    items.forEach((item, i) => {
      item.classList.toggle("ring-2", i === activeIndex);
      item.classList.toggle("ring-blue-500", i === activeIndex);
    });
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div ref={containerRef} className={cn("outline-none")}>
      {children}
      <p className="mt-3 text-xs text-muted-foreground">
        Dica: use ↑/↓ pra navegar, Enter pra aceitar a proposta selecionada, C pra abrir o chat.
      </p>
    </div>
  );
}
