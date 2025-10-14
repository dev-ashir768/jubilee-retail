import { OrdersListFilterType } from "@/types/apiFilterTypes";
import { create } from "zustand";

interface OrdersListFilterStoreProps {
  filterValue: OrdersListFilterType;
  setFilterValue: (filterValue: OrdersListFilterType) => void;
  resetFilterValue: () => void;
}

const initialFilterValues = {
  month: null,
  order_status: null,
};

export const OrdersListFilterStore = create<OrdersListFilterStoreProps>(
  (set, store) => ({
    filterValue: initialFilterValues,
    setFilterValue: (newFilterValue: OrdersListFilterType) =>
      set({ filterValue: newFilterValue }),
    resetFilterValue: () => set({ filterValue: initialFilterValues }),
  })
);
