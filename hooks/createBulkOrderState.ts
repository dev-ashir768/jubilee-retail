import { CreateBulkOrder } from "@/types/createBulkOrder";
import { create } from "zustand";

interface CreateBulkOrderStateProps {
  jsonResult: CreateBulkOrder[] | null;
  setJsonResult: (jsonResult: CreateBulkOrder[] | null) => void;
}

export const createBulkOrderState = create<CreateBulkOrderStateProps>(
  (set) => ({
    jsonResult: null,
    setJsonResult: (newJsonResult) =>
      set(() => ({ jsonResult: newJsonResult })),
  })
);
