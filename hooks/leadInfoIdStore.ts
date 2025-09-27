import { create } from "zustand";

interface useLeadsInfoIdStoreProps {
  leadInfoId: number | null;
  setLeadInfoId: (leadInfoId: number | null) => void;
}
const useLeadInfoIdStore = create<useLeadsInfoIdStoreProps>(
  (set) => ({
    leadInfoId: null,
    setLeadInfoId: (newLeadInfoId) =>
      set(() => ({ leadInfoId: newLeadInfoId })),
  })
);

export default useLeadInfoIdStore;
