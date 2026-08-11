import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json({ error: "Missing env vars" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get user from auth.users
    const { data: users, error: userError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (userError || !users || users.length === 0) {
      return Response.json(
        { error: "User not found or error getting user", details: userError },
        { status: 404 }
      );
    }

    const userId = users[0].id;

    // Insert into profiles
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: email,
        full_name: "",
        role: "freelancer",
        plan: "free",
      })
      .select();

    if (error) {
      return Response.json(
        { error: "Failed to create profile", details: error },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Profile created successfully",
      profile: data,
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
