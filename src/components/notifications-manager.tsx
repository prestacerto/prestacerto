"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff } from "lucide-react";

export function NotificationsManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      const supported =
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      setIsSupported(supported);

      if (supported && "serviceWorker" in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;
          const subscription = await reg.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error("[NOTIF MANAGER] Check error:", error);
        }
      }

      setLoading(false);
    };

    checkSupport();
  }, []);

  const handleToggleNotifications = async () => {
    try {
      if (isSubscribed) {
        await unsubscribeFromNotifications();
      } else {
        await subscribeToNotifications();
      }
    } catch (error) {
      console.error("[NOTIF MANAGER] Toggle error:", error);
      alert("Erro ao alterar notificações");
    }
  };

  const subscribeToNotifications = async () => {
    setLoading(true);

    if (Notification.permission === "denied") {
      alert("Notificações foram bloqueadas no navegador");
      setLoading(false);
      return;
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setLoading(false);
        return;
      }
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await fetch("/api/push-notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error("[NOTIF MANAGER] Subscribe error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    setLoading(true);

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push-notifications/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        await subscription.unsubscribe();
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("[NOTIF MANAGER] Unsubscribe error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Notificações Push</CardTitle>
            <CardDescription>
              Receba alertas sobre novas propostas e mensagens
            </CardDescription>
          </div>
          {isSubscribed && (
            <Badge variant="default" className="bg-green-600">
              Ativas
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleToggleNotifications}
          disabled={loading}
          variant={isSubscribed ? "destructive" : "default"}
          className="w-full"
        >
          {loading ? (
            "Carregando..."
          ) : isSubscribed ? (
            <>
              <BellOff className="mr-2 h-4 w-4" />
              Desativar Notificações
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Ativar Notificações
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          {isSubscribed
            ? "Você está recebendo notificações push em tempo real"
            : "Ative as notificações para receber alertas instantâneos"}
        </p>
      </CardContent>
    </Card>
  );
}
