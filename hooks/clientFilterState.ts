import { ClientFilterValue } from "@/types/clientTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface clientFilterStateProps {
  filterValue: ClientFilterValue;
  filterCount: number;
  setFilterValue: (newFilterValue: ClientFilterValue) => void;
  resetFilterValue: () => void;
}

export const initialFilterValue = {
  branch: null,
};

export const clientFilterState = create<clientFilterStateProps>()(
  persist(
    (set) => ({
      filterValue: initialFilterValue,
      filterCount: 0,
      setFilterValue: (newFilterValue) => {
        const count = Object.values(newFilterValue).filter(
          (v) => v !== null
        ).length;

        set({
          filterValue: newFilterValue,
          filterCount: count,
        });
      },
      resetFilterValue: () => {
        set({
          filterValue: initialFilterValue,
          filterCount: 0,
        });
      },
    }),
    { name: "client-filter-store" }
  )
);
