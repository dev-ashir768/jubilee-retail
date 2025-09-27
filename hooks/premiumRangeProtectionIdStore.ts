import { create } from "zustand";

interface usePremiumRangeProtectionIdStoreProps {
  premiumRangeProtectionId: number | null;
  setPremiumRangeProtectionId: (premiumRangeProtectionId: number | null) => void;
}
const usePremiumRangeProtectionIdStore = create<usePremiumRangeProtectionIdStoreProps>((set) => ({
  premiumRangeProtectionId: null,
  setPremiumRangeProtectionId: (newPremiumRangeProtectionId) =>
    set(() => ({ premiumRangeProtectionId: newPremiumRangeProtectionId })),
}));

export default usePremiumRangeProtectionIdStore;
