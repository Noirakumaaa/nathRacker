import { create } from 'zustand';

type SelectedIds = {
  swdi?: number;
lcn?: number;
  cvs?: number;
  bus?: number;
  misc? : number
};

type Store = {
  selectedIds: SelectedIds;
  setSelectedId: (key: keyof SelectedIds, id: number) => void;
  clearSelectedId: (key: keyof SelectedIds) => void;
  clearAll: () => void;
};

export const useSelectedID = create<Store>((set) => ({
  selectedIds: {},

  setSelectedId: (key, id) =>
    set((state) => ({
      selectedIds: {
        ...state.selectedIds,
        [key]: id,
      },
    })),

  clearSelectedId: (key) =>
    set((state) => {
      const updated = { ...state.selectedIds };
      delete updated[key];
      return { selectedIds: updated };
    }),

  clearAll: () => set({ selectedIds: {} }),
}));