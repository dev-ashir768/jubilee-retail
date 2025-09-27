import { create } from "zustand";

interface useProductCategoryIdStoreProps {
  productCategoryId: number | null;
  setProductCategoryId: (productCategoryId: number | null) => void;
}
const useProductCategoryIdStore = create<useProductCategoryIdStoreProps>(
  (set) => ({
    productCategoryId: null,
    setProductCategoryId: (newProductCategoryId) =>
      set(() => ({ productCategoryId: newProductCategoryId })),
  })
);

export default useProductCategoryIdStore;
