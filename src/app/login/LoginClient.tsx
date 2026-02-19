"use client";

import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import AppLogo from "../app/components/AppLogo";
import { FcGoogle } from "react-icons/fc";

export default function LoginClient() {
  const supabase = createSupabaseBrowserClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // ✅ works on localhost + vercel without env var
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-between px-6 py-14">
        {/* Top */}
        <div className="flex w-full flex-col items-center">
          <div className="flex items-center gap-3">
            <AppLogo size={44} />
            <div className="text-2xl font-semibold text-gray-900">
              MyBookmarks
            </div>
          </div>

          <div className="mt-14 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Welcome to MyBookmarks
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Save and manage your bookmarks securely.
            </p>

            <button
              onClick={signInWithGoogle}
              className="mt-10 inline-flex w-[360px] items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-gray-800 shadow-sm ring-1 ring-black/10 transition hover:bg-gray-50"
            >
              <FcGoogle className="h-6 w-6" />
              Sign in with Google
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full">
          <div className="mx-auto mt-14 h-px w-full max-w-xl bg-gray-200" />
          <p className="mt-10 text-center text-sm text-gray-400">
            Securely encrypted and private
          </p>
        </div>
      </div>
    </main>
  );
}
