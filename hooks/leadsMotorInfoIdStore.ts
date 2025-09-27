import { create } from "zustand";

interface useLeadsMotorInfoIdStoreProps {
  leadsMotorInfoId: number | null;
  setLeadsMotorInfoId: (leadsMotorInfoId: number | null) => void;
}
const useLeadsMotorInfoIdStore = create<useLeadsMotorInfoIdStoreProps>(
  (set) => ({
    leadsMotorInfoId: null,
    setLeadsMotorInfoId: (newLeadsMotorInfoId) =>
      set(() => ({ leadsMotorInfoId: newLeadsMotorInfoId })),
  })
);

export default useLeadsMotorInfoIdStore;
