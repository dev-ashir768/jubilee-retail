import { create } from "zustand";

interface useProductOptionsIdStoreProps {
  productOptionsId: number | null;
  setProductOptionsId: (productOptionsId: number | null) => void;
}
const useProductOptionsIdStore = create<useProductOptionsIdStoreProps>(
  (set) => ({
    productOptionsId: null,
    setProductOptionsId: (newProductOptionsId) =>
      set(() => ({ productOptionsId: newProductOptionsId })),
  })
);

export default useProductOptionsIdStore;
