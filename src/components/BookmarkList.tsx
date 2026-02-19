"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";

type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
};

export function BookmarkList({ userId }: { userId: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);
    if (!error) setItems((data ?? []) as Bookmark[]);
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    // realtime will update
  };

  if (loading) return <p className="text-gray-600">Loading…</p>;
  if (items.length === 0) return <p className="text-gray-600">No bookmarks yet.</p>;

  return (
    <ul className="space-y-2">
      {items.map((b) => (
        <li
          key={b.id}
          className="flex items-center justify-between rounded-xl border p-4"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{b.title}</p>
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="truncate text-sm text-blue-600 hover:underline"
            >
              {b.url}
            </a>
          </div>

          <button
            onClick={() => onDelete(b.id)}
            className="ml-4 rounded-lg border px-3 py-1.5 hover:bg-gray-50"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
