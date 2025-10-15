import { OrdersListFilterType } from "@/types/apiFilterTypes";
import { create } from "zustand";

interface OrdersListFilterStoreProps {
  filterValue: OrdersListFilterType;
  setFilterValue: (filterValue: OrdersListFilterType) => void;
  filterCount: number;
  setFilterCount: (filterCount: number) => void;
  resetFilterValue: () => void;
}

const initialFilterValues = {
  month: null,
  order_status: null,
  contact: null,
  cnic: null,
  payment_mode_id: null,
  branch_id: null,
  api_user_id: null,
  product_id: null,
};

export const OrdersListFilterStore = create<OrdersListFilterStoreProps>(
  (set) => ({
    filterValue: initialFilterValues,
    filterCount: 0,
    setFilterCount: (newFilterCount: number) =>
      set({ filterCount: newFilterCount }),
    setFilterValue: (newFilterValue: OrdersListFilterType) =>
      set({ filterValue: newFilterValue }),
    resetFilterValue: () =>
      set({ filterValue: initialFilterValues, filterCount: 0 }),
  })
);
