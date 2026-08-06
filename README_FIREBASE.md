# 🔥 FIREBASE SETUP — 3 MINUTOS

## ⚡ O que você precisa fazer (RÁPIDO)

### Passo 1️⃣: Login no Google (30 segundos)
👉 Abre isso: https://console.firebase.google.com

Clica seu email → faz login com sua conta Google

---

### Passo 2️⃣: Criar Projeto (1 minuto)
1. Clica **"+ Add project"** (botão azul)
2. **Nome:** `prestacerto`
3. Desabilita "Google Analytics" (não precisa)
4. Clica **"Create project"**
5. Aguarda ~30 segundos enquanto cria

---

### Passo 3️⃣: Copiar Credenciais (1 minuto)
1. Vai pro seu projeto (clica nele)
2. Clica ⚙️ **"Project Settings"** (no rodapé esquerdo)
3. Scroll down → "Your apps" → Clica **"</> Web"**
4. Copia o bloco `firebaseConfig` que aparece:

```javascript
{
  apiKey: "AIza...",
  authDomain: "prestacerto.firebaseapp.com",
  projectId: "prestacerto-xxx",
  storageBucket: "prestacerto-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

---

### Passo 4️⃣: Configurar Firestore (30 segundos)
1. Na página do projeto, clica **"Firestore Database"** (esquerda)
2. Clica **"Create Database"**
3. Seleciona **"São Paulo"** (region)
4. Seleciona **"Production mode"**
5. Clica **"Create"**

---

### Passo 5️⃣: Configurar Authentication (30 segundos)
1. Clica **"Authentication"** (esquerda)
2. Clica **"Get Started"**
3. Clica **"Email/Password"** → ativa → salva
4. (Opcional) Clica **"Google"** → ativa com projeto → salva

---

### Passo 6️⃣: Cola Credenciais Aqui
Abre arquivo: `/Users/cadusima/prestacerto/.env.local`

Substitui as linhas:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...       ← Cole aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...       ← Cole aqui
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...        ← Cole aqui
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...    ← Cole aqui
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...  ← Cole aqui
NEXT_PUBLIC_FIREBASE_APP_ID=...            ← Cole aqui
```

---

### Pronto! ✅

Avisa quando terminar, que eu faço o resto:
- Deploy na Vercel
- Test end-to-end
- Coloca no ar

---

**Tempo total: ~5 minutos**
**Seu trabalho: copiar 6 linhas de código**

Pode ser? 🤝
