"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const STORAGE_KEY = "prestacerto:sidebar-collapsed";

export function DashboardSidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê localStorage (só existe no client) pra restaurar preferência salva
    setMounted(true);
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  };

  return (
    <aside
      className={cn(
        "hidden shrink-0 transition-[width] duration-200 md:block",
        mounted && collapsed ? "w-14" : "w-48"
      )}
    >
      <nav className="sticky top-24 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground",
                mounted && collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {(!mounted || !collapsed) && item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className={cn(
            "mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            mounted && collapsed && "justify-center px-2"
          )}
        >
          {mounted && collapsed ? (
            <PanelLeftOpen className="size-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="size-4 shrink-0" />
              Recolher
            </>
          )}
        </button>
      </nav>
    </aside>
  );
}
