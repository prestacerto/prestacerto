import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json({ error: 'Missing env vars' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Execute via raw SQL through Postgres connection
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles(
          id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email text UNIQUE,
          full_name text,
          role text DEFAULT 'freelancer',
          plan text DEFAULT 'free',
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid()=id);
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid()=id);
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $
        BEGIN
          INSERT INTO public.profiles(id,email,full_name,role,plan)
          VALUES(new.id,new.email,'','freelancer','free')
          ON CONFLICT(id) DO NOTHING;
          RETURN new;
        END;
        $;
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, message: 'Database initialized!' });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
