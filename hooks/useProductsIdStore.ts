import { create } from "zustand";

interface useProductsIdStoreProps {
  productsId: number | null;
  setProductsId: (productsId: number | null) => void;
}
const useProductsIdStore = create<useProductsIdStoreProps>((set) => ({
  productsId: null,
  setProductsId: (newProductsId) => set(() => ({ productsId: newProductsId })),
}));

export default useProductsIdStore;
