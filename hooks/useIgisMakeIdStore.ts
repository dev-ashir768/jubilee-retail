import { create } from "zustand";

interface useIgisMakeIdStoreProps {
  igisMakeId: number | null;
  setIgisMakeId: (agentId: number) => void;
}

const useDevelopmentOfficerIdStore = create<useIgisMakeIdStoreProps>(
  (set) => ({
    igisMakeId: null,
    setIgisMakeId: (newIgisMakeId: number) =>
      set(() => ({ igisMakeId: newIgisMakeId })),
  })
);

export default useDevelopmentOfficerIdStore;
