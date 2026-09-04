import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const categorySlugs: Record<string, string> = {
  desenvolvimento: "desenvolvimento-web",
  design: "design-grafico",
  marketing: "marketing-digital",
  conteudo: "redacao-conteudo",
};

function parseBudget(value: unknown) {
  const budget = typeof value === "number" ? value : Number(value);
  return Number.isFinite(budget) && budget > 0 ? Math.round(budget * 100) / 100 : null;
}

function parseDeadlineDays(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const deadline = new Date(`${value}T23:59:59`);
  if (Number.isNaN(deadline.getTime())) return null;

  const days = Math.ceil((deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  return Math.max(1, Math.min(days, 730));
}

function parseSkills(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((skill): skill is string => typeof skill === "string")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 20);
}

async function insertProjectWithCompatibleStatus(
  client: Awaited<ReturnType<typeof createClient>> | ReturnType<typeof createServiceClient>,
  payload: {
    client_id: string;
    category_id: number | null;
    title: string;
    description: string;
    skills: string[];
    budget_min: number;
    budget_max: number;
    deadline_days: number | null;
    category: string;
  },
) {
  const baseSelect = "id, title, description, skills, budget_min, budget_max, deadline_days, status, created_at";

  const openAttempt = await client
    .from("projects")
    .insert({
      ...payload,
      status: "open",
    })
    .select(baseSelect)
    .single();

  if (!openAttempt.error || openAttempt.data) {
    return openAttempt;
  }

  const fallbackAttempt = await client
    .from("projects")
    .insert({
      ...payload,
      status: "aberto",
    })
    .select(baseSelect)
    .single();

  if (!fallbackAttempt.error || fallbackAttempt.data) {
    return fallbackAttempt;
  }

  // Alguns ambientes de produção ainda usam a primeira versão da tabela
  // projects. Ela guarda orçamento em centavos e categoria como texto. Em vez
  // de deixar a publicação inteira falhar durante a migração, mantemos este
  // caminho compatível até que o schema seja consolidado.
  return client
    .from("projects")
    .insert({
      client_id: payload.client_id,
      title: payload.title,
      description: payload.description,
      skills: payload.skills,
      budget_cents: Math.round(payload.budget_max * 100),
      deadline: payload.deadline_days
        ? new Date(Date.now() + payload.deadline_days * 24 * 60 * 60 * 1000).toISOString()
        : null,
      category: payload.category || "geral",
      status: "aberto",
    })
    .select("id, title, description, skills, status, created_at")
    .single();
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Faça login para publicar um projeto." }, { status: 401 });
    }

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const budget = parseBudget(body.budget);
    const deadlineDays = parseDeadlineDays(body.deadline);
    const skills = parseSkills(body.skills);
    const requestedCategory = typeof body.category === "string" ? body.category : "";

    if (title.length < 5 || description.length < 20 || budget === null) {
      return NextResponse.json(
        { error: "Título, descrição e orçamento válido são obrigatórios." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const admin = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServiceClient() : null;
    const profileClient = admin ?? supabase;

    const { data: profile, error: profileError } = await profileClient
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Erro ao carregar perfil antes da publicação:", profileError.message);
    }

    let effectiveProfile = profile;

    if (!effectiveProfile) {
      const fallbackRole =
        user.user_metadata?.role === "client" || user.user_metadata?.role === "both"
          ? user.user_metadata.role
          : "client";
      const fallbackName =
        typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
          ? user.user_metadata.full_name.trim()
          : user.email?.split("@")[0] || "Novo cliente";

      const { data: createdProfile, error: createProfileError } = await profileClient
        .from("profiles")
        .insert({
          id: user.id,
          role: fallbackRole,
          full_name: fallbackName,
        })
        .select("id, role, full_name")
        .single();

      if (createProfileError) {
        console.warn("Aviso ao criar perfil ausente:", createProfileError.message);
        // Não bloqueia — permite publicar com dados do auth.user_metadata
      } else if (createdProfile) {
        effectiveProfile = createdProfile;
      }
    }

    const role = effectiveProfile?.role ?? user.user_metadata?.role;
    if (role !== "client" && role !== "both") {
      return NextResponse.json({ error: "A publicação de projetos está disponível para contas de cliente." }, { status: 403 });
    }

    let categoryId: number | null = null;
    const categorySlug = categorySlugs[requestedCategory];

    if (categorySlug) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (categoryError) {
        console.warn("Não foi possível resolver a categoria; o projeto seguirá sem categoria:", categoryError.message);
      } else {
        categoryId = category?.id ?? null;
      }
    }

    const projectClient = admin ?? supabase;

    const { data: project, error } = await insertProjectWithCompatibleStatus(projectClient, {
      client_id: user.id,
      category_id: categoryId,
      title,
      description,
      skills,
      budget_min: budget,
      budget_max: budget,
      deadline_days: deadlineDays,
      category: requestedCategory,
    });

    if (error || !project) {
      console.error("Erro Supabase ao persistir projeto:", error?.message);
      return NextResponse.json(
        { error: "Não foi possível salvar o projeto. Verifique a configuração do banco e tente novamente." },
        { status: 500 },
      );
    }

    revalidatePath("/projects");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      project,
      message: "Projeto publicado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json(
      { error: "Não foi possível publicar o projeto agora." },
      { status: 500 },
    );
  }
}
