"use client";

import { Bell, BellOff } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useState, useEffect } from "react";

export function PushNotificationBell() {
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isSupported) return null;

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors ${
        isSubscribed
          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      title={isSubscribed ? "Desativar notificações" : "Ativar notificações"}
    >
      {isSubscribed ? <Bell size={20} /> : <BellOff size={20} />}
    </button>
  );
}
