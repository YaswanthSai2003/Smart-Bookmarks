import AppShell from "./shell";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function AppPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const email = user.email ?? "";
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null;

  return <AppShell userId={user.id} userEmail={email} avatarUrl={avatarUrl} />;
}
