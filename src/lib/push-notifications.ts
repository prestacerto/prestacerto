// Web Push Notifications

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Send subscription to server
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error("Push subscription failed:", error);
    return null;
  }
}

export async function sendPushNotification(notification: PushNotification) {
  try {
    const response = await fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send push notification:", error);
    return false;
  }
}

// Pre-defined notifications

export const PUSH_NOTIFICATIONS = {
  new_project: (projectTitle: string, budget: string) => ({
    title: "⚡ Nova oportunidade para você!",
    body: `${projectTitle} por ${budget} - matches seu perfil!`,
    tag: "new_project",
    data: { type: "new_project" },
  }),

  proposal_accepted: (projectTitle: string, amount: string) => ({
    title: "🎉 Proposta Aceita!",
    body: `${projectTitle} - Você ganhou ${amount}!`,
    tag: "proposal_accepted",
    data: { type: "proposal_accepted" },
  }),

  project_ending_soon: (projectTitle: string, timeLeft: string) => ({
    title: "⏰ Projeto fechando em breve",
    body: `${projectTitle} - Responda AGORA! ${timeLeft}`,
    tag: "project_ending",
    data: { type: "project_ending" },
  }),

  friend_earning: (friendName: string, amount: string) => ({
    title: "🔥 Seu colega ganhou dinheiro!",
    body: `${friendName} just made ${amount}. Que tal ganhar também?`,
    tag: "social_proof",
    data: { type: "social_proof" },
  }),

  milestone_reached: (badge: string) => ({
    title: "🏆 Badge Desbloqueado!",
    body: `Você conquistou: ${badge}`,
    tag: "badge_unlocked",
    data: { type: "badge_unlocked" },
  }),

  daily_reminder: () => ({
    title: "💡 Aproveite o dia!",
    body: "Você tem 5 novas oportunidades esperando. Responda agora!",
    tag: "daily_reminder",
    data: { type: "daily_reminder" },
  }),

  promotion: (discount: number) => ({
    title: `🎁 ${discount}% OFF - Tempo limitado!`,
    body: "Upgrade para Premium agora e ganhe 3x mais!",
    tag: "promotion",
    data: { type: "promotion", discount },
  }),

  payment_confirmation: (planName: string) => ({
    title: "✅ Pagamento Confirmado!",
    body: `Seu plano ${planName} está ativo. Comece a usar agora!`,
    tag: "payment_confirmation",
    data: { type: "payment_confirmation" },
  }),
};

// Check if user has notification permission
export function hasNotificationPermission(): boolean {
  return typeof Notification !== "undefined" && Notification.permission === "granted";
}

// Get notification preferences from localStorage
export function getNotificationPreferences() {
  try {
    const prefs = localStorage.getItem("pushNotificationPrefs");
    return prefs
      ? JSON.parse(prefs)
      : {
          new_project: true,
          proposal_accepted: true,
          friend_earning: true,
          daily_reminder: false,
          promotions: true,
        };
  } catch {
    return {};
  }
}

// Set notification preferences
export function setNotificationPreferences(prefs: Record<string, boolean>) {
  localStorage.setItem("pushNotificationPrefs", JSON.stringify(prefs));
}
