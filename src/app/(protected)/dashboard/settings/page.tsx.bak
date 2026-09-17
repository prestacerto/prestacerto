"use client";

import { NotificationsManager } from "@/components/notifications-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e notificações</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <NotificationsManager />

        <Card>
          <CardHeader>
            <CardTitle>PWA (App Instalável)</CardTitle>
            <CardDescription>Instale o PrestaCerto como um app no seu dispositivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>📱 App Instalável:</strong> Você pode instalar o PrestaCerto como um app no seu telefone ou computador. Clique no menu do navegador e selecione "Instalar app" ou "Install PWA".
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-900">
                <strong>🔌 Funciona Offline:</strong> Acesse seus projetos e propostas mesmo sem internet. Suas ações serão sincronizadas automaticamente quando voltar online.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-900">
                <strong>⚡ Mais Rápido:</strong> O app é mais rápido que o navegador pois carrega os assets em cache.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Status da Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Service Worker</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PWA Support</span>
                <Badge className="bg-green-100 text-green-800">Suportado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Push Notifications</span>
                <Badge className="bg-green-100 text-green-800">Disponível</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offline Mode</span>
                <Badge className="bg-green-100 text-green-800">Pronto</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Background Sync</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
