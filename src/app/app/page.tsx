import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import AppShell from "./shell";

export default async function AppPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const avatarUrl =
    (user.user_metadata as { avatar_url?: string; picture?: string } | null)
      ?.avatar_url ||
    (user.user_metadata as { avatar_url?: string; picture?: string } | null)
      ?.picture ||
    null;

  return (
    <AppShell
      userId={user.id}
      userEmail={user.email ?? ""}
      avatarUrl={avatarUrl}
    />
  );
}
