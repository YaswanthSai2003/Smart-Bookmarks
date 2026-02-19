"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import { ChevronDown } from "lucide-react";

import type { BookmarkRow, FilterKey, SortKey, Category } from "./types";
import Chip from "./components/Chip";
import AddBookmarkCard from "./components/AddBookmarkCard";
import BookmarkRowView from "./components/BookmarkRow";
import EditBookmarkModal from "./components/EditBookmarkModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

type TagSummary = { name: string; count: number };

export default function BookmarksClient({
  userId,
  query,
  filter,
  sort,
  selectedTag,
  onSelectTag,
  onTagsSummary,
  onCounts,
  onChangeFilter,
  onChangeSort,
  tagOptions,
}: {
  userId: string;
  query: string;
  filter: FilterKey;
  sort: SortKey;

  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onTagsSummary?: (summary: TagSummary[]) => void;

  onCounts?: (c: {
    all: number;
    favorites: number;
    work: number;
    learning: number;
    personal: number;
  }) => void;

  onChangeFilter: (f: FilterKey) => void;
  onChangeSort: (s: SortKey) => void;

  tagOptions: string[];
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [items, setItems] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);

  // add form
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // edit modal
  const [editing, setEditing] = useState<BookmarkRow | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("all");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editTags, setEditTags] = useState<string[]>([]);

  // delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const normalizeUrl = (u: string) => u.trim();

  const load = async () => {
    setLoading(true);
    const ascending = sort === "oldest";

    const { data, error } = await supabase
      .from("bookmarks")
      .select("id,user_id,title,url,category,is_favorite,tags,created_at,updated_at")
      .order("created_at", { ascending });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setItems((data ?? []) as BookmarkRow[]);
  };

  // realtime subscribe + initial load
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setup = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) supabase.realtime.setAuth(token);

      await load();

      channel = supabase
        .channel(`bookmarks-${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` },
          (payload) => {
            if (payload.eventType === "DELETE") {
              const deletedId = (payload.old as { id?: string } | null)?.id;
              if (typeof deletedId === "string") {
                setItems((prev) => prev.filter((x) => x.id !== deletedId));
                return;
              }
            }

            // For INSERT / UPDATE
            load();
          }
        )
        .subscribe();

      supabase.auth.onAuthStateChange((_event, session) => {
        supabase.realtime.setAuth(session?.access_token ?? "");
      });
    };

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId, sort]);

  // sidebar tag 
  useEffect(() => {
    const summary = tagOptions.map((name) => {
      const count = items.filter((b) => Array.isArray(b.tags) && b.tags.includes(name)).length;
      return { name, count };
    });
    onTagsSummary?.(summary);
  }, [items, tagOptions, onTagsSummary]);

  // sidebar counts (category + favorites)
  useEffect(() => {
    const all = items.length;
    const favorites = items.filter((b) => b.is_favorite).length;
    const work = items.filter((b) => (b.category ?? "all") === "work").length;
    const learning = items.filter((b) => (b.category ?? "all") === "learning").length;
    const personal = items.filter((b) => (b.category ?? "all") === "personal").length;

    onCounts?.({ all, favorites, work, learning, personal });
  }, [items, onCounts]);

  const onAdd = async (data: { title: string; url: string; category: Category; tags: string[] }) => {
    setFormError(null);

    const t = data.title.trim();
    const normalized = normalizeUrl(data.url);

    if (!t) {
      toast.error("Title is required");
      setFormError("Title is required");
      return;
    }
    if (!normalized) {
      toast.error("URL is required");
      setFormError("URL is required");
      return;
    }

    // Duplicate prevention
    const exists = items.some((x) => x.url.trim().toLowerCase() === normalized.toLowerCase());
    if (exists) {
      toast.error("This bookmark already exists.");
      return;
    }

    setSaving(true);

    const optimistic: BookmarkRow = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: t,
      url: normalized,
      category: data.category,
      is_favorite: false,
      tags: data.tags ?? [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItems((prev) => [optimistic, ...prev]);

    const { data: row, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        title: t,
        url: normalized,
        category: data.category,
        tags: data.tags ?? [],
      })
      .select("id,user_id,title,url,category,is_favorite,tags,created_at,updated_at")
      .single();

    setSaving(false);

    if (error) {
      const pgCode = (error as { code?: string } | null)?.code;
      if (pgCode === "23505") toast.error("Duplicate bookmark (already added).");
      else toast.error(error.message);

      setItems((prev) => prev.filter((x) => x.id !== optimistic.id));
      setFormError(error.message);
      return;
    }

    setItems((prev) => [row as BookmarkRow, ...prev.filter((x) => x.id !== optimistic.id)]);

    setTitle("");
    setUrl("");
    setCategory("all");

    toast.success("Bookmark added");
  };

  const toggleFavorite = async (b: BookmarkRow) => {
    const nextFav = !b.is_favorite;

    // optimistic
    setItems((prev) => prev.map((x) => (x.id === b.id ? { ...x, is_favorite: nextFav } : x)));

    const { error } = await supabase.from("bookmarks").update({ is_favorite: nextFav }).eq("id", b.id);

    if (error) {
      toast.error(error.message);
      await load(); // rollback safely
      return;
    }

    toast.success(nextFav ? "Added to favorites" : "Removed from favorites");
  };

  const openEdit = (b: BookmarkRow) => {
    setEditing(b);
    setEditTitle(b.title);
    setEditUrl(b.url);
    setEditCategory(((b.category ?? "all") as Category) ?? "all");
    setEditTags(Array.isArray(b.tags) ? b.tags : []);
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editing) return;

    const t = editTitle.trim();
    const u = editUrl.trim();

    if (!t) {
      setEditError("Title is required");
      toast.error("Title is required");
      return;
    }
    if (!u) {
      setEditError("URL is required");
      toast.error("URL is required");
      return;
    }

    setEditError(null);
    setEditSaving(true);

    const { error } = await supabase
      .from("bookmarks")
      .update({ title: t, url: u, category: editCategory, tags: editTags })
      .eq("id", editing.id);

    setEditSaving(false);

    if (error) {
      toast.error(error.message);
      setEditError(error.message);
      return;
    }

    // update local state for immediate sidebar counts
    setItems((prev) =>
      prev.map((x) => (x.id === editing.id ? { ...x, title: t, url: u, category: editCategory, tags:editTags } : x))
    );

    toast.success("Bookmark updated");
    setEditing(null);
  };

  const requestDelete = (id: string) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);

    const prev = items;
    setItems((p) => p.filter((x) => x.id !== deleteId));

    const { error } = await supabase.from("bookmarks").delete().eq("id", deleteId);

    setDeleteLoading(false);

    if (error) {
      setItems(prev);
      toast.error(error.message);
      return;
    }

    toast.success("Bookmark deleted");
    setDeleteId(null);
  };

  {/* Filtering */}
  const q = query.trim().toLowerCase();
  const filtered = items.filter((b) => {
    const matchesQuery = !q || b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q);

    const cat = (b.category ?? "all") as Category;
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "favorites"
        ? b.is_favorite
        : filter === "work"
        ? cat === "work"
        : filter === "learning"
        ? cat === "learning"
        : filter === "personal"
        ? cat === "personal"
        : true;

    const matchesTag =
      !selectedTag ||
      (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));

    return matchesQuery && matchesFilter && matchesTag;
  });

  return (
    <div className="space-y-5">
      <AddBookmarkCard
        title={title}
        url={url}
        category={category}
        saving={saving}
        error={formError}
        tagOptions={tagOptions}
        onChangeTitle={setTitle}
        onChangeUrl={setUrl}
        onChangeCategory={setCategory}
        onSubmit={onAdd}
      />

      <section className="flex flex-wrap items-center gap-3">
        <Chip label="All" active={filter === "all"} onClick={() => onChangeFilter("all")} />
        <Chip label="Favorites" active={filter === "favorites"} onClick={() => onChangeFilter("favorites")} />
        <Chip label="Work" active={filter === "work"} onClick={() => onChangeFilter("work")} />
        <Chip label="Learning" active={filter === "learning"} onClick={() => onChangeFilter("learning")} />
        <Chip label="Personal" active={filter === "personal"} onClick={() => onChangeFilter("personal")} />

        {selectedTag && (
          <button
            type="button"
            onClick={() => onSelectTag(null)}
            className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            Tag: {selectedTag} ✕
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <div className="text-sm text-gray-600">Sort by:</div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-black/5 hover:bg-gray-50"
            onClick={() => onChangeSort(sort === "latest" ? "oldest" : "latest")}
          >
            {sort === "latest" ? "Latest" : "Oldest"}
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </section>

      <section className="space-y-3">
        {loading ? (
          <>
            <div className="h-20 rounded-3xl bg-white ring-1 ring-black/5" />
            <div className="h-20 rounded-3xl bg-white ring-1 ring-black/5" />
            <div className="h-20 rounded-3xl bg-white ring-1 ring-black/5" />
          </>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-sm font-semibold text-gray-900">No bookmarks found</div>
            <div className="mt-1 text-sm text-gray-600">Try changing filters/tags or add a new bookmark.</div>
          </div>
        ) : (
          filtered.map((b) => (
            <BookmarkRowView
              key={b.id}
              b={b}
              onToggleFavorite={() => toggleFavorite(b)}
              onEdit={() => openEdit(b)}
              onDelete={() => requestDelete(b.id)}
              onTagClick={(t) => onSelectTag(t)}
            />
          ))
        )}
      </section>

      {editing && (
        <EditBookmarkModal
          editing={editing}
          editTitle={editTitle}
          editUrl={editUrl}
          editCategory={editCategory}
          editTags={editTags}
          tagOptions={tagOptions}
          editError={editError}
          saving={editSaving}
          onClose={() => setEditing(null)}
          onChangeTitle={setEditTitle}
          onChangeUrl={setEditUrl}
          onChangeCategory={setEditCategory}
          onChangeTags={setEditTags}
          onSave={saveEdit}
        />
      )}

      <ConfirmDeleteModal
        open={!!deleteId}
        loading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
