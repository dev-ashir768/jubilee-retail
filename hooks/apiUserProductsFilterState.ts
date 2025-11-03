import { create } from "zustand";
import { persist } from "zustand/middleware";

interface apiUserProductsFilterStateProps {
  filterValue: number[] | null;
  filterCount: number;
  setFilterValue: (filterValue: number[]) => void;
  resetFilterValue: () => void;
}

export const apiUserProductsFilterState =
  create<apiUserProductsFilterStateProps>()(
    persist(
      (set) => ({
        filterValue: null,
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
            filterValue: null,
            filterCount: 0,
          });
        },
      }),
      {
        name: "api-user-product-filter-store",
      }
    )
  );
