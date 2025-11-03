import { ProductFilterType } from "@/types/productsTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface couponFilterStateProps {
  filterValue: ProductFilterType | null;
  filterCount: number;
  setFilterValue: (newFilterValue: ProductFilterType) => void;
  resetFilterValue: () => void;
}

export const couponFilterState = create<couponFilterStateProps>()(
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
      name: "coupon-filter-store",
    }
  )
);
