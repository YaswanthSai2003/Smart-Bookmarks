"use client";

import { Bookmark } from "lucide-react";

export default function AppLogo({
  size = 44,
}: {
  size?: number;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className="
        flex items-center justify-center
        rounded-2xl
        bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500
        shadow-sm
      "
    >
      <Bookmark className="h-5 w-5 text-white" />
    </div>
  );
}
