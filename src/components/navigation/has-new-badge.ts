import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

/**
 * Check if a specific category has content (projects/services)
 * Used to decide whether to show "NOVO" badge on menu items
 *
 * Returns true only if category has 1+ active items
 */
export async function shouldShowBadge(
  category: string,
  type: "projects" | "services"
): Promise<boolean> {
  try {
    const table = type === "projects" ? "projects" : "services";

    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact" })
      .eq("category_id", category)
      .eq("is_active", true)
      .limit(1);

    if (error) {
      console.error(`Error checking badge for ${category}:`, error);
      // Default to NOT showing badge if error
      return false;
    }

    // Only show badge if there's at least 1 active item
    return (count || 0) > 0;
  } catch (error) {
    console.error("Badge check failed:", error);
    return false;
  }
}

/**
 * Cache badge status for 1 hour to avoid hammering DB
 * Pattern: badge:projects:category_name -> boolean
 */
export async function shouldShowBadgeCached(
  category: string,
  type: "projects" | "services"
): Promise<boolean> {
  const cacheKey = `badge:${type}:${category}`;

  // For now, just call the main function
  // In production, this would use Redis
  return shouldShowBadge(category, type);
}
