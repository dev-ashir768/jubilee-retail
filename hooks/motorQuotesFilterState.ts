import { create } from "zustand";
import { persist } from "zustand/middleware";

interface motorQuotesFilterStateProps {
  filterValue: ("pending" | "cancelled" | "approved")[] | null;
  filterCount: number;
  setFilterValue: (
    newFilterValue: ("pending" | "cancelled" | "approved")[]
  ) => void;
  resetFilterValue: () => void;
}

export const motorQuotesFilterState = create<motorQuotesFilterStateProps>()(
  persist(
    (set) => ({
      filterValue: null,
      filterCount: 0,
      setFilterValue: (newFilterValue) => {
        const count = Object.values(newFilterValue!).filter(
          (v) => v !== null
        ).length;

        set({
          filterValue: newFilterValue,
          filterCount: count,
        });
      },
      resetFilterValue: () => {
        set({
          filterValue: null,
          filterCount: 0,
        });
      },
    }),
    {
      name: "motor-quote-filter-store",
    }
  )
);
