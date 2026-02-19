"use client";

import { useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  url: z.string().url("Enter a valid URL (include https://)"),
});

export function BookmarkForm({ userId }: { userId: string }) {
  const supabase = createSupabaseBrowserClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ title, url });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("bookmarks").insert({
      user_id: userId,
      title: parsed.data.title,
      url: parsed.data.url,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-lg border px-3 py-2"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="rounded-lg border px-3 py-2"
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="mt-3 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add bookmark"}
      </button>
    </form>
  );
}
