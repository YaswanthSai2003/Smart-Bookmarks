import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import AppShell from "./shell";

export default async function AppPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const email = user.email ?? "";

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;

  const avatarUrl =
    (typeof meta.avatar_url === "string" ? meta.avatar_url : null) ??
    (typeof meta.picture === "string" ? meta.picture : null);

  return <AppShell userId={user.id} userEmail={email} avatarUrl={avatarUrl} />;
}
