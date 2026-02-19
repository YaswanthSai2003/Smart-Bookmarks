"use client";

import type { Category } from "../types";

export default function EditBookmarkModal({
  editing,
  editTitle,
  editUrl,
  editCategory,
  editTags,
  tagOptions,
  editError,
  saving,
  onClose,
  onChangeTitle,
  onChangeUrl,
  onChangeCategory,
  onChangeTags,
  onSave,
}: {
  editing: { id: string };
  editTitle: string;
  editUrl: string;
  editCategory: Category;
  editTags: string[];
  tagOptions: string[];
  editError: string | null;
  saving: boolean;

  onClose: () => void;
  onChangeTitle: (v: string) => void;
  onChangeUrl: (v: string) => void;
  onChangeCategory: (v: Category) => void;
  onChangeTags: (v: string[]) => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">Edit bookmark</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input
              value={editTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
              className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-black/5 focus:bg-white focus:ring-black/10"
              placeholder="Title"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-gray-700">URL</label>
            <input
              value={editUrl}
              onChange={(e) => onChangeUrl(e.target.value)}
              className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-black/5 focus:bg-white focus:ring-black/10"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                value={editCategory}
                onChange={(e) => onChangeCategory(e.target.value as Category)}
                className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-black/5 focus:bg-white focus:ring-black/10"
              >
                <option value="all">All</option>
                <option value="work">Work</option>
                <option value="learning">Learning</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">Tags</label>

              {/* preset tags only (multi-select style) */}
              <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                {tagOptions.map((t) => {
                  const active = editTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        if (active) onChangeTags(editTags.filter((x) => x !== t));
                        else onChangeTags([...editTags, t]);
                      }}
                      className={[
                        "rounded-full px-3 py-1 text-sm font-semibold transition",
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 ring-1 ring-black/10 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {editError && <div className="text-sm font-semibold text-red-600">{editError}</div>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
