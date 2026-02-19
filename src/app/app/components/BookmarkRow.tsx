"use client";

import { Pencil, Star, Trash2, Tag } from "lucide-react";
import type { BookmarkRow as BookmarkType } from "../types";
import { faviconUrl, timeAgo } from "../utils";

function prettyCategory(cat: string | null | undefined) {
  const c = (cat ?? "all").trim();
  if (!c) return "All";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

// small deterministic color map for tags
function tagColorClass(tag: string) {
  const t = tag.toLowerCase();
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < t.length; i++) hash = (hash * 31 + t.charCodeAt(i)) >>> 0;
  return colors[hash % colors.length];
}

export default function BookmarkRow({
  b,
  onToggleFavorite,
  onEdit,
  onDelete,
  onTagClick,
}: {
  b: BookmarkType;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTagClick?: (tag: string) => void;
}) {
  const icon = faviconUrl(b.url);
  const category = (b.category ?? "all") as string;
  const tags = Array.isArray(b.tags) ? b.tags : [];

  return (
    <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex min-w-0 items-center gap-4">
        {/* favicon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-black/5">
          {icon ? (
            <img src={icon} alt="" className="h-7 w-7" />
          ) : (
            <div className="h-7 w-7 rounded bg-gray-200" />
          )}
        </div>

        {/* title + url */}
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold text-gray-900">{b.title}</div>
          <div className="truncate text-sm text-blue-600">
            <a href={b.url} target="_blank" rel="noreferrer" className="hover:underline">
              {b.url}
            </a>
          </div>

          {/* tags (mobile) */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
              {tags.slice(0, 3).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTagClick?.(t)}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-black/5 hover:bg-gray-100"
                  title={`Filter tag: ${t}`}
                >
                  <span className={`h-2 w-2 rounded-full ${tagColorClass(t)}`} />
                  {t}
                </button>
              ))}
              {tags.length > 3 && (
                <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-black/5">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* badges & tags */}
        <div className="hidden items-center gap-2 md:flex">
          {b.is_favorite && (
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-700">
              <Star className="h-4 w-4" />
              Favorites
            </span>
          )}

          {category !== "all" && (
            <span className="rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
              {prettyCategory(category)}
            </span>
          )}

          {tags.length > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
              <Tag className="h-4 w-4" />
              {tags.length}
            </span>
          )}
          {tags.slice(0, 2).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTagClick?.(t)}
              className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 ring-1 ring-black/5 hover:bg-gray-100"
              title={`Filter tag: ${t}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${tagColorClass(t)}`} />
              {t}
            </button>
          ))}

          {tags.length > 2 && (
            <span className="rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-600 ring-1 ring-black/5">
              +{tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <div className="hidden md:block">{timeAgo(b.created_at)}</div>

        <button
          type="button"
          onClick={onToggleFavorite}
          className="rounded-xl p-2 hover:bg-gray-50"
          title={b.is_favorite ? "Remove favorite" : "Add favorite"}
        >
          <Star className={b.is_favorite ? "h-5 w-5 text-yellow-500" : "h-5 w-5 text-gray-400"} />
        </button>

        <button type="button" onClick={onEdit} className="rounded-xl p-2 hover:bg-gray-50" title="Edit">
          <Pencil className="h-5 w-5 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl p-2 hover:bg-gray-50"
          title="Delete"
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
