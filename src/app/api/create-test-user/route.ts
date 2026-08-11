import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: "kadusima@hotmail.com",
      password: "cadusima1234",
      email_confirm: true,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, user: data.user });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
