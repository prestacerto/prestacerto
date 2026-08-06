# 🔥 Firebase Setup para PrestaCerto

## ⚡ Passo-a-Passo Rápido (3 minutos)

### 1️⃣ Cria Projeto Firebase
Vai pra https://console.firebase.google.com
- Clica "+ Create project"
- Nome: `prestacerto`
- Aceita os termos
- Clica "Create"
- Aguarda 30 segundos

### 2️⃣ Copia as Credenciais
Na página do projeto:
- Clica no ícone ⚙️ (Settings) → "Project settings"
- Scroll down → "Your apps"
- Clica "</> Web" (se não tiver, clica "+ Add app")
- Copia o objeto `firebaseConfig`
- Fica assim:
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

### 3️⃣ Cola em `.env.local`
Abre `/Users/cadusima/prestacerto/.env.local` e preenche:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prestacerto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prestacerto-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prestacerto-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4️⃣ Configura Firestore
No Firebase Console:
- Clica "Firestore Database" (esquerda)
- Clica "Create database"
- Seleciona "São Paulo" (region)
- Seleciona "Start in production mode"
- Clica "Create"
- Aguarda 1 minuto

### 5️⃣ Configura Authentication
No Firebase Console:
- Clica "Authentication" (esquerda)
- Clica "Get started"
- Habilita: "Email/Password"
- Habilita: "Google" (optional)

---

## ✅ Pronto!

Deploy pra Vercel:
```bash
git add .
git commit -m "Migrate to Firebase"
git push
```

Vercel faz deploy automático!

---

**Tempo total:** ~5 minutos
