#!/usr/bin/env node

/**
 * Este script cria um Firebase project programaticamente
 * Requer: Google Cloud Project com Firebase API habilitada
 */

const projectId = `prestacerto-${Date.now()}`;
const displayName = "PrestaCerto - Freelancer Marketplace";

console.log(`
╔════════════════════════════════════════════════════════════╗
║         FIREBASE PROJECT CREATION ASSISTANT               ║
╚════════════════════════════════════════════════════════════╝

⚠️  Para criar um Firebase project automaticamente, você precisa:

1. Uma Google Cloud Account com Billing habilitado
2. Firebase Management API ativada
3. Service Account JSON file com credenciais

📋 ALTERNATIVA RÁPIDA (3 minutos):

1. Abre: https://console.firebase.google.com
2. Clica "+ Add project"
3. Nome: "prestacerto"
4. Ativa Firestore + Auth
5. Vai pra: Project Settings → Web App
6. Copia as 6 chaves (apiKey, authDomain, etc)
7. Cola no arquivo .env.local

🚀 OU envia as credenciais e eu completo tudo!

---

NEXT STEPS:

💻 Opção 1: Criar agora (manual)
   $ open https://console.firebase.google.com

💾 Opção 2: Se tiver credenciais de serviço Google
   $ export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
   $ npm run setup:firebase

🎯 Opção 3: Usar Firebase Emulator (local testing)
   $ npm install -g firebase-tools
   $ firebase init emulators

---
`);

process.exit(0);
