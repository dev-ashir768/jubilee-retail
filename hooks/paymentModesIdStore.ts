import { create } from "zustand";

interface usePaymentModesIdStoreProps {
  paymentModesId: number | null;
  setPaymentModesId: (paymentModesId: number | null) => void;
}
const usePaymentModesIdStore = create<usePaymentModesIdStoreProps>((set) => ({
  paymentModesId: null,
  setPaymentModesId: (newPaymentModesId) =>
    set(() => ({ paymentModesId: newPaymentModesId })),
}));

export default usePaymentModesIdStore;
