import { create } from "zustand";

interface useMotorQuoteIdStoreProps {
  motorQuoteId: number | null;
  setMotorQuoteId: (motorQuoteId: number) => void;
}

const useMotorQuoteIdStore = create<useMotorQuoteIdStoreProps>((set) => ({
  motorQuoteId: null,
  setMotorQuoteId: (newMotorQuoteId: number) => set(() => ({ motorQuoteId: newMotorQuoteId })),
}));

export default useMotorQuoteIdStore;
