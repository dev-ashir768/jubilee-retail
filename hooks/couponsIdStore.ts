import { create } from "zustand";

interface useCouponsIdStoreProps {
  couponsId: number | null;
  setCouponsId: (couponsId: number | null) => void;
}
const useCouponsIdStore = create<useCouponsIdStoreProps>((set) => ({
  couponsId: null,
  setCouponsId: (newCouponsId) => set(() => ({ couponsId: newCouponsId })),
}));

export default useCouponsIdStore;
