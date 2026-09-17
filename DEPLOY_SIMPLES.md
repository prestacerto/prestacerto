# 🚀 GUIA COMPLETO DE DEPLOYMENT - PRESTACERTO

## ⚠️ LEIA TUDO ANTES DE COMEÇAR

Este guia vai colocar o site **prestacerto.com.br** online em um servidor próprio.

---

## PARTE 1: COMPRAR SERVIDOR (Digital Ocean)

### Passo 1.1: Criar conta no Digital Ocean
- Acesse: https://www.digitalocean.com
- Clique em "Sign Up"
- Use email, senha
- Confirme email
- Adicione cartão de crédito

### Passo 1.2: Criar um Droplet (servidor)
- No painel, clique em "Create" (canto superior direito)
- Selecione "Droplets"

**Configure assim:**

| Campo | Valor |
|-------|-------|
| Choose an image | Ubuntu 24.04 LTS x64 |
| Choose a size | Basic - $6/mês (suficiente) |
| Choose a region | São Paulo (spl1) |
| Authentication | SSH Key (crie uma chave SSH) |
| Hostname | prestacerto |

- Clique em "Create Droplet"
- **Aguarde 1 minuto** até o servidor ficar pronto
- Copie o IP do servidor (ex: `123.45.67.89`)

---

## PARTE 2: CONECTAR AO SERVIDOR

### Passo 2.1: Abrir Terminal/PowerShell

**MacOS/Linux:**
```bash
ssh root@123.45.67.89
```

**Windows (PowerShell):**
```powershell
ssh root@123.45.67.89
```

Quando pedir "Tem certeza?" → Digite: `yes`

Pronto! Você está dentro do servidor.

---

## PARTE 3: INSTALAR DEPENDÊNCIAS

Cole cada linha uma por uma no terminal (copiar + colar):

### Passo 3.1: Atualizar sistema
```bash
apt update && apt upgrade -y
```
(Aguarde terminar - pode levar 1-2 minutos)

### Passo 3.2: Instalar Docker
```bash
apt install -y docker.io docker-compose git curl
```
(Aguarde terminar)

### Passo 3.3: Dar permissão ao Docker
```bash
usermod -aG docker root
```

---

## PARTE 4: BAIXAR O CÓDIGO

### Passo 4.1: Entrar na pasta home
```bash
cd /root
```

### Passo 4.2: Clonar o repositório
```bash
git clone https://github.com/prestacerto/prestacerto.git
```

### Passo 4.3: Entrar na pasta do projeto
```bash
cd prestacerto
```

---

## PARTE 5: FAZER DEPLOY

### Passo 5.1: Dar permissão ao script
```bash
chmod +x deploy.sh
```

### Passo 5.2: Rodar o deploy
```bash
./deploy.sh
```

**Aguarde até aparecer:**
```
✅ Container running on port 3000
=== Deploy Complete ===
🌐 Access: http://localhost:3000
```

**🎉 PRONTO! Site está rodando!**

---

## PARTE 6: CONFIGURAR DOMÍNIO (prestacerto.com.br)

### Passo 6.1: Pegar o IP do servidor
- Volte para o painel do Digital Ocean
- Copie o IP (ex: `123.45.67.89`)

### Passo 6.2: Ir para o provedor de domínio
- Acesse o site onde você comprou o domínio (GoDaddy, Namecheap, Registro.br, etc)
- Vá para "DNS Settings" ou "Manage DNS"
- Procure por "A Record" ou "DNS Records"

### Passo 6.3: Criar registro DNS
Crie UM registro com estas informações:

| Campo | Valor |
|-------|-------|
| Type | A |
| Name/Host | @ (ou deixe vazio) |
| Value/Points to | 123.45.67.89 (seu IP) |
| TTL | 3600 |

- Clique em "Save" ou "Create"
- **Aguarde 5-15 minutos** para a mudança fazer efeito

### Passo 6.4: Testar
- Abra o navegador
- Acesse: `http://prestacerto.com.br`
- Se aparecer o site → **FUNCIONOU! ✅**

---

## PARTE 7: CONFIGURAR HTTPS (SEGURANÇA)

**IMPORTANTE:** Só faça isso DEPOIS que o domínio estiver funcionando em HTTP

### Passo 7.1: Conectar ao servidor novamente
```bash
ssh root@123.45.67.89
```

### Passo 7.2: Instalar Nginx
```bash
apt install -y nginx
```

### Passo 7.3: Editar arquivo de configuração
```bash
nano /etc/nginx/sites-available/default
```

**Delete tudo que está dentro** e cole isso:

```nginx
server {
    listen 80;
    server_name prestacerto.com.br www.prestacerto.com.br;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- Pressione: `Ctrl + X`
- Pressione: `Y`
- Pressione: `Enter`

### Passo 7.4: Reiniciar Nginx
```bash
systemctl restart nginx
```

### Passo 7.5: Instalar certificado SSL (HTTPS)
```bash
apt install -y certbot python3-certbot-nginx
```

### Passo 7.6: Gerar certificado
```bash
certbot --nginx -d prestacerto.com.br -d www.prestacerto.com.br
```

Quando pedir email → Digite seu email e pressione Enter  
Quando pedir para concordar → Digite: `y` e Enter

**Pronto!** O site agora usa HTTPS automáticamente.

---

## ✅ CHECKLIST FINAL

- [ ] Conta Digital Ocean criada
- [ ] Droplet criado ($6/mês)
- [ ] SSH funcionando
- [ ] Docker instalado
- [ ] Código clonado
- [ ] Deploy feito (./deploy.sh)
- [ ] Site online em http://IP:3000
- [ ] Domínio apontando para IP
- [ ] Site acessível em http://prestacerto.com.br
- [ ] HTTPS configurado
- [ ] Site funcionando em https://prestacerto.com.br

---

## 🆘 PROBLEMAS?

### Site não carrega
```bash
docker ps
```
Se não aparecer `prestacerto`, rodar:
```bash
cd /root/prestacerto && ./deploy.sh
```

### Ver logs de erro
```bash
docker logs prestacerto
```

### Reiniciar container
```bash
docker restart prestacerto
```

### Atualizar código do GitHub
```bash
cd /root/prestacerto
git pull
./deploy.sh
```

---

## 📧 SUPORTE
Se travar em algo, anote exatamente onde travou e copie a mensagem de erro.

**Sucesso! 🚀**
