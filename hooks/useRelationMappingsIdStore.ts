import { create } from "zustand";

interface useRelationMappingsIdStoreProps {
  relationMappingId: number | null;
  setRelationMappingId: (relationMappingId: number | null) => void;
}
const useRelationMappingsIdStore = create<useRelationMappingsIdStoreProps>(
  (set) => ({
    relationMappingId: null,
    setRelationMappingId: (newRelationMappingId) =>
      set(() => ({ relationMappingId: newRelationMappingId })),
  })
);

export default useRelationMappingsIdStore;
