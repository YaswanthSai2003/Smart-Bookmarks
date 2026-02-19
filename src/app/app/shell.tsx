"use client";

import React, { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import {
  Bookmark,
  Star,
  Folder,
  BookOpen,
  User,
  Search,
  ChevronDown,
  Tag,
} from "lucide-react";
import AppLogo from "./components/AppLogo";
import BookmarksClient from "./BookmarksClient";
import type { FilterKey, SortKey } from "./types";

type TagSummary = { name: string; count: number };

export default function AppShell({
  userId,
  userEmail,
  avatarUrl,
}: {
  userId: string;
  userEmail: string;
  avatarUrl: string | null;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("latest");

  
  // tags
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagSummary, setTagSummary] = useState<TagSummary[]>([]);
  // preset tags only (does not grow)

  const [tagOptions] = useState<string[]>([
    "development",
    "learning",
    "news",
    "website",
    "others",
  ]);

  // sidebar counts
  const [counts, setCounts] = useState({
    all: 0,
    favorites: 0,
    work: 0,
    learning: 0,
    personal: 0,
  });

  // profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="h-screen bg-[#f6f8fb]">
      <div className="flex h-full">
        {/* Sidebar (fixed) */}
        <aside className="hidden w-80 shrink-0 bg-white lg:flex lg:flex-col">
          <div className="px-6 py-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <AppLogo size={44} />
              <span className="text-lg font-semibold text-gray-900">
                MyBookmarks
              </span>
            </div>

            {/* Nav */}
            <div className="mt-8 space-y-2">
              <SideItem
                label="All Bookmarks"
                icon={<Bookmark className="h-5 w-5" />}
                selected={filter === "all"}
                count={counts.all}
                onClick={() => {
                  setSelectedTag(null);
                  setFilter("all");
                }}
              />

              <SideItem
                label="Favorites"
                icon={<Star className="h-5 w-5" />}
                selected={filter === "favorites"}
                count={counts.favorites}
                onClick={() => {
                  setSelectedTag(null);
                  setFilter("favorites");
                }}
              />

              <SideItem
                label="Work"
                icon={<Folder className="h-5 w-5" />}
                selected={filter === "work"}
                count={counts.work}
                onClick={() => {
                  setSelectedTag(null);
                  setFilter("work");
                }}
              />

              <SideItem
                label="Learning"
                icon={<BookOpen className="h-5 w-5" />}
                selected={filter === "learning"}
                count={counts.learning}
                onClick={() => {
                  setSelectedTag(null);
                  setFilter("learning");
                }}
              />

              <SideItem
                label="Personal"
                icon={<User className="h-5 w-5" />}
                selected={filter === "personal"}
                count={counts.personal}
                onClick={() => {
                  setSelectedTag(null);
                  setFilter("personal");
                }}
              />
            </div>

            {/* Tags */}
            <div className="mt-10">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="h-4 w-4 text-gray-500" />
                Tags
              </div>

              <div className="mt-4 space-y-2">
                {tagSummary.map((t) => (
                  <TagRow
                    key={t.name}
                    name={t.name}
                    count={t.count}
                    active={selectedTag?.toLowerCase() === t.name.toLowerCase()}
                    onClick={() => setSelectedTag(t.name)}
                  />
                ))}

                {tagSummary.length === 0 && (
                  <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600 ring-1 ring-black/5">
                    No tags yet.
                  </div>
                )}

                {selectedTag && (
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className="mt-2 w-full rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Clear tag filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex h-full flex-1 flex-col">
          {/* Topbar*/}
          <header className="shrink-0 bg-white">
            <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 lg:hidden">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-500" />
                <div className="font-semibold text-gray-900">MyBookmarks</div>
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bookmarks..."
                  className="w-full rounded-2xl bg-gray-50 py-2.5 pl-11 pr-4 text-sm outline-none ring-1 ring-black/5 focus:bg-white focus:ring-black/10"
                />
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-2xl px-2 py-1.5 hover:bg-gray-50"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                      {userEmail?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border bg-white shadow-lg">
                    <div className="px-4 py-3">
                      <div className="text-xs text-gray-500">Signed in as</div>
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {userEmail}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setProfileOpen(false);
                        await supabase.auth.signOut();
                        window.location.href = "/login";
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-5 py-6">
              <BookmarksClient
                userId={userId}
                query={query}
                filter={filter}
                sort={sort}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                onTagsSummary={setTagSummary}
                onCounts={setCounts}
                onChangeFilter={setFilter}
                onChangeSort={setSort}
                tagOptions={tagOptions}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SideItem({
  label,
  icon,
  selected,
  count,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium",
        selected ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      <span className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
        {label}
      </span>

      {typeof count === "number" && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
          {count}
        </span>
      )}
    </button>
  );
}
const TAG_DOT_COLORS: Record<string, string> = {
  development: "bg-indigo-500",
  learning: "bg-emerald-500",
  news: "bg-amber-500",
  website: "bg-sky-500",
  others: "bg-gray-400",
};

function TagRow({
  name,
  count,
  active,
  onClick,
}: {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const dotColor =
    TAG_DOT_COLORS[name.toLowerCase()] ?? "bg-gray-400";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium ring-1 ring-black/5",
        active
          ? "bg-blue-50 text-blue-700"
          : "bg-white text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      <span className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
        {name}
      </span>

      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
        {count}
      </span>
    </button>
  );
}

