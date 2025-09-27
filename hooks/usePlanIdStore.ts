import { create } from "zustand";

interface usePlanIdStoreProps {
  planId: number | null;
  setPlanId: (planId: number | null) => void;
}
const usePlanIdStore = create<usePlanIdStoreProps>((set) => ({
  planId: null,
  setPlanId: (newPlanId) => set(() => ({ planId: newPlanId })),
}));

export default usePlanIdStore;
