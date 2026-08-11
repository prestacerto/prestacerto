import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Primeiro tenta deletar o usuário existente
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users.find((u) => u.email === email);

    if (user) {
      await supabase.auth.admin.deleteUser(user.id);
      console.log("User deleted:", email);
    }

    // Cria novo usuário com a senha
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({
      success: true,
      message: "User created/reset successfully",
      user: data.user,
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
