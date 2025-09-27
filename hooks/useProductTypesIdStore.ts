import { create } from "zustand";

interface useProductTypesIdStoreProps {
  productTypeId: number | null;
  setProductTypeId: (productTypeId: number | null) => void;
}
const useProductTypesIdStore = create<useProductTypesIdStoreProps>((set) => ({
  productTypeId: null,
  setProductTypeId: (newProductTypeId) =>
    set(() => ({ productTypeId: newProductTypeId })),
}));

export default useProductTypesIdStore;
