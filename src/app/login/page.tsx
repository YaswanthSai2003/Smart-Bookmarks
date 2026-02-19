"use client";

import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import { FcGoogle } from "react-icons/fc";
import AppLogo from "../app/components/AppLogo";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <AppLogo size={42} />
          <span className="text-2xl font-semibold text-gray-800">
            MyBookmarks
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome to MyBookmarks
        </h1>
        <p className="mt-3 text-base text-gray-500">
          Save and manage your bookmarks securely.
        </p>

        {/* Google Button */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="mt-10 inline-flex items-center gap-4 rounded-xl cursor-pointer border border-gray-200 bg-white px-10 py-4 text-lg font-semibold text-gray-600 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition hover:bg-gray-50 active:scale-[0.98]"
        >
          <FcGoogle className="h-7 w-7" />
          Sign in with Google
        </button>
      </div>
      {/* Footer */}
      <footer className="px-6 pb-10">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 h-px w-full bg-gray-200" />
          <p className="text-center text-sm text-gray-400">
            Securely encrypted and private
          </p>
        </div>
      </footer>
    </main>
  );
}
