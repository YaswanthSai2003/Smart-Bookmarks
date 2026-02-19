export type FilterKey = "all" | "favorites" | "work" | "learning" | "personal";
export type SortKey = "latest" | "oldest";

export type Category = "all" | "work" | "learning" | "personal";

export type BookmarkRow = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  category: Category;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};
