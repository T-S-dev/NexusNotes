import { create } from "zustand";

type PageStore = {
  deletingPageId: string | null;
  setDeletingPageId: (pageId: string | null) => void;
};

export const usePageStore = create<PageStore>((set) => ({
  deletingPageId: null,
  setDeletingPageId: (pageId) => set({ deletingPageId: pageId }),
}));
