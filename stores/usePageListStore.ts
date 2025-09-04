import { create } from "zustand";
import type { PagePermission } from "@/types";

type PagesState = {
  pages: PagePermission[];
  ownedPages: PagePermission[];
  sharedPages: PagePermission[];
  isLoading: boolean;
  error: Error | null;
  setPages: (pages: PagePermission[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
};

export const usePagesStore = create<PagesState>((set) => ({
  pages: [],
  ownedPages: [],
  sharedPages: [],
  isLoading: true,
  error: null,
  setPages: (pages) =>
    set({
      pages,
      ownedPages: pages.filter((p) => p.role === "owner"),
      sharedPages: pages.filter((p) => p.role !== "owner"),
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
