import { ordersFilterType } from "@/types/apiFilterTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface policyListFilterStateProps {
  filterValue: ordersFilterType;
  filterCount: number;
  setFilterValue: (filterValue: ordersFilterType) => void;
  resetFilterValue: () => void;
}

const initialFilterValue = {
  month: null,
  order_status: null,
  policy_status: null,
  contact: null,
  cnic: null,
  payment_mode_id: null,
  branch_id: null,
  api_user_id: null,
  product_id: null,
};

export const policyListFilterState = create<policyListFilterStateProps>()(
  persist(
    (set) => ({
      filterValue: initialFilterValue,
      filterCount: 0,
      setFilterValue: (newFilterValue) => {
        const count = Object.values(newFilterValue).filter(
          (v) => v !== null && v !== ""
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
    {
      name: "policy-list-filter-store",
    }
  )
);
