# PrestaCerto — Launch Checklist

## ✅ Code (DONE)
- Scaffold Next.js + TypeScript + Tailwind
- Supabase auth + RLS security
- Pages: Home, Auth, Services, Projects, Plans, Contact
- APIs: proposals, project-contact reveal, messages
- Dashboard: services CRUD, projects, proposals

## 🚀 Deployment Steps (DO NOW)

### 1. Supabase Setup (5 min)
```
1. Create project at supabase.com
2. Copy NEXT_PUBLIC_SUPABASE_URL
3. Copy NEXT_PUBLIC_SUPABASE_ANON_KEY
4. SQL Editor: run supabase/migrations/0001_init.sql
```

### 2. Update .env.local (1 min)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Push to GitHub (2 min)
```bash
git add . && git commit -m "Deploy" && git push
```

### 4. Vercel Deployment (5 min)
```
1. Go to vercel.com/dashboard
2. Add New → Project → Connect GitHub
3. Add env vars (same 2 from Supabase)
4. Deploy ✓
```

## 🎯 MVP Features Live
- ✅ Freelancer registration + profile
- ✅ Service listing & search
- ✅ Project posting (with mandatory contact)
- ✅ Proposal submission
- ✅ Conditional contact reveal (after acceptance)
- ✅ Email notifications

## 📋 Future Phases
- [ ] Phase 2: Internal messaging (chat)
- [ ] Phase 3: Payment processing (Mercado Pago)
- [ ] Phase 4: Reviews & ratings
- [ ] Phase 5: Admin dashboard

## 🔒 Security Notes
- 3-layer defense: middleware + server-side check + RLS
- Contact only revealed after proposal acceptance
- All protected routes require authentication
- Database-level access control via RLS policies

---
Created: 2026-08-03
Ready for: pilot program launch
