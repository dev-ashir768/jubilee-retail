import { create } from "zustand";

interface filterCountStoreProps {
  filterCount: number;
  setFilterCount: (filterCount: number) => void;
  resetFilterCount: () => void;
}

export const filterCountStore = create<filterCountStoreProps>((set) => ({
  filterCount: 0,
  setFilterCount: (newFilterCount: number) =>
    set({ filterCount: newFilterCount }),
  resetFilterCount: () => set({ filterCount: 0 }),
}));
