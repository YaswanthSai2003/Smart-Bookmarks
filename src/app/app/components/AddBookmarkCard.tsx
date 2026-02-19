"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import Field from "./Field";
import type { Category } from "../types";

const addSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  url: z.string().url("Enter a valid URL (include https://)"),
  category: z.enum(["all", "work", "learning", "personal"]),
});

function norm(t: string) {
  return t.trim().replace(/\s+/g, " ");
}

export default function AddBookmarkCard({
  title,
  url,
  category,
  saving,
  error,
  tagOptions,
  onChangeTitle,
  onChangeUrl,
  onChangeCategory,
  onSubmit,
}: {
  title: string;
  url: string;
  category: Category;
  saving: boolean;
  error: string | null;
  tagOptions: string[];

  onChangeTitle: (v: string) => void;
  onChangeUrl: (v: string) => void;
  onChangeCategory: (v: Category) => void;

  onSubmit: (data: { title: string; url: string; category: Category; tags: string[] }) => void;
}) {
  const [localError, setLocalError] = useState<string | null>(null);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSelect, setTagSelect] = useState("");

  const sortedOptions = useMemo(() => {
    const uniq = Array.from(new Set(tagOptions.map(norm).filter(Boolean)));
    uniq.sort((a, b) => a.localeCompare(b));
    return uniq;
  }, [tagOptions]);

  const addTagFromSelect = (tag: string) => {
    const t = norm(tag);
    if (!t) return;
    setSelectedTags((prev) => {
      if (prev.some((x) => x.toLowerCase() === t.toLowerCase())) return prev;
      return [...prev, t].slice(0, 6);
    });
  };

  const removeTag = (t: string) => setSelectedTags((p) => p.filter((x) => x !== t));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const parsed = addSchema.safeParse({ title, url, category });
    if (!parsed.success) {
      setLocalError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    onSubmit({
      title: parsed.data.title,
      url: parsed.data.url,
      category: parsed.data.category as Category,
      tags: selectedTags,
    });
  };

  return (
    <section
      id="add-bookmark-card"
      className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"
    >
      <div className="text-xl font-semibold text-gray-900">Add New Bookmark</div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Title *">
          <input
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="e.g., Google Official Site"
            className="w-full bg-transparent border-0 p-0 text-sm outline-none"
          />
        </Field>

        <Field label="URL *">
          <input
            value={url}
            onChange={(e) => onChangeUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-transparent border-0 p-0 text-sm outline-none"
          />
        </Field>

        <Field label="Category">
          <select
            value={category}
            onChange={(e) => onChangeCategory(e.target.value as Category)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="work">Work</option>
            <option value="learning">Learning</option>
            <option value="personal">Personal</option>
          </select>
        </Field>

        <Field label="Tags">
          <select
            value={tagSelect}
            onChange={(e) => {
              const v = e.target.value;
              setTagSelect("");
              addTagFromSelect(v);
            }}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="">Select a tag</option>
            {sortedOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        {selectedTags.length > 0 && (
          <div className="md:col-span-2 flex flex-wrap gap-2">
            {selectedTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => removeTag(t)}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                title="Remove tag"
              >
                {t} ✕
              </button>
            ))}
          </div>
        )}

        {(localError || error) && (
          <p className="md:col-span-2 text-sm text-red-600">
            {localError ?? error}
          </p>
        )}

        <div className="md:col-span-2 flex items-center justify-end">
          <button
            disabled={saving}
            className="rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}
