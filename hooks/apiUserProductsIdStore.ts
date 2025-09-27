import { create } from "zustand";

interface useApiUserProductsIdStoreProps {
  apiUserProductsId: number | null;
  setApiUserProductsId: (apiUserProductsId: number | null) => void;
}
const useApiUserProductsIdStore = create<useApiUserProductsIdStoreProps>((set) => ({
  apiUserProductsId: null,
  setApiUserProductsId: (newApiUserProductsId) =>
    set(() => ({ apiUserProductsId: newApiUserProductsId })),
}));

export default useApiUserProductsIdStore;
