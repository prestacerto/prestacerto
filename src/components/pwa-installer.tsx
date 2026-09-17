"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Development asset URLs are not content-hashed. A cache-first worker would
    // keep serving obsolete JS/CSS after hot reload or a local server restart.
    if (process.env.NODE_ENV !== "production") return;
    const handler = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    let idleId: number | undefined;
    let timerId: number | undefined;
    const register = () => {
      navigator.serviceWorker.register("/service-worker.js").catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
    };
    const scheduleRegistration = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(register, { timeout: 3000 });
      } else {
        timerId = window.setTimeout(register, 0);
      }
    };

    // Keep install events attached immediately, but avoid competing with page assets.
    if ("serviceWorker" in navigator) {
      if (document.readyState === "complete") scheduleRegistration();
      else window.addEventListener("load", scheduleRegistration, { once: true });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("load", scheduleRegistration);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Download className="text-blue-600" size={20} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Instalar PrestaCerto</p>
          <p className="text-xs text-slate-600 mt-1">
            Acesse pela tela inicial. Uma conexão é necessária para projetos e mensagens.
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar aviso de instalação"
          onClick={() => setShowPrompt(false)}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleInstall}
          className="min-h-11 flex-1 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Instalar
        </button>
        <button
          type="button"
          onClick={() => setShowPrompt(false)}
          className="min-h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Depois
        </button>
      </div>
    </div>
  );
}
