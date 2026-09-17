// Push Notifications (Web Push API)
export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Enviar subscription pro servidor
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    console.log('✅ Push notifications ativadas!');
    return subscription;
  } catch (error) {
    console.error('❌ Erro ao ativar push:', error);
  }
}

export async function sendPushNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: Record<string, any>;
  }
) {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/logo.png',
        badge: '/badge.png',
        ...options,
        tag: options?.tag || 'certo-ai',
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }
}

// Tipos de notificações
export const notificationTypes = {
  WELCOME: {
    title: '🎉 Bem-vindo ao Certo AI!',
    body: 'Você tem 3 otimizações grátis. Comece agora!',
  },
  OPTIMIZATION_SUCCESS: (score: number) => ({
    title: `🚀 Proposta otimizada!`,
    body: `Score: ${score}/100. Taxa de ganho: ${score}%+`,
  }),
  UPGRADE_PROMPT: {
    title: '⚡ Upgrade disponível',
    body: 'Ilimitadas por R$ 19,90/mês',
  },
  DAILY_REMINDER: {
    title: '💡 Dia de sorte!',
    body: '5 novos projetos chegaram. Quer otimizar propostas?',
  },
  MATCH_SUGGESTION: (matchScore: number) => ({
    title: `🎯 Projeto com ${matchScore}% match!`,
    body: 'Recomendamos enviar proposta neste projeto',
  }),
  BEST_TIMING: {
    title: '⏰ Hora de ouro!',
    body: 'Cliente está online agora. Melhor momento pra enviar.',
  },
};
