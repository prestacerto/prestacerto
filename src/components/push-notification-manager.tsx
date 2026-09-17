"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Bell, BellOff } from "lucide-react";

const subscribeSupport = () => () => {};
const readSupport = () => typeof window !== "undefined" && typeof navigator !== "undefined"
  && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
const serverSupport = () => false;

export function PushNotificationManager() {
  const isSupported = useSyncExternalStore(subscribeSupport, readSupport, serverSupport);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSupported) return;
    let active = true;
    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (!active) return;
        const subscription = await registration.pushManager.getSubscription();
        if (active) setIsSubscribed(!!subscription);
      } catch (error) {
        if (active) console.error("Error checking subscription:", error);
      }
    };
    void checkSubscription();
    return () => { active = false; };
  }, [isSupported]);

  const handleToggleNotifications = async () => {
    setIsLoading(true);

    try {
      if (isSubscribed) {
        // Unsubscribe
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          setIsSubscribed(false);

          // Notify backend
          await fetch("/api/push-notifications/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
        }
      } else {
        // Subscribe
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            alert("Permissão de notificações recusada");
            return;
          }
        }

        if (Notification.permission !== "granted") {
          alert("Habilite notificações nas configurações do navegador");
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!vapidPublicKey) {
          console.error("VAPID public key not configured");
          return;
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        setIsSubscribed(true);

        // Send subscription to backend
        await fetch("/api/push-notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: subscription.toJSON(),
          }),
        });
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      alert("Erro ao alterar notificações");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        type="button"
        onClick={handleToggleNotifications}
        disabled={isLoading}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubscribed ? (
          <>
            <Bell size={16} className="text-green-600" />
            Notificações ON
          </>
        ) : (
          <>
            <BellOff size={16} className="text-slate-400" />
            Notificações OFF
          </>
        )}
      </button>
    </div>
  );
}

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
