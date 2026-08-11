import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Disable and re-enable RLS
    await supabase.rpc("query", {
      sql: "ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY",
    });

    await supabase.rpc("query", {
      sql: "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY",
    });

    // Insira um perfil padrão para o usuário
    const { data: user } = await supabase.auth.admin.listUsers();
    if (user?.users?.[0]) {
      const userId = user.users[0].id;
      await supabase.from("profiles").upsert({
        id: userId,
        email: user.users[0].email,
        role: "freelancer",
        full_name: "User",
      });
    }

    return Response.json({
      success: true,
      message: "RLS fixed and profile created",
    });
  } catch (err) {
    console.error("Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
