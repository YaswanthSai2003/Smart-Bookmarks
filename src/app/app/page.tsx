import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import AppShell from "./shell";

export default async function AppPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const meta = user.user_metadata as { avatar_url?: string; picture?: string } | null;
  const avatarUrl = meta?.avatar_url ?? meta?.picture ?? null;

  return (
    <AppShell
      userId={user.id}
      userEmail={user.email ?? ""}
      avatarUrl={avatarUrl}
    />
  );
}
