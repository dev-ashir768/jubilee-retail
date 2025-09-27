import { create } from "zustand";

interface useWebAppMappersIdStoreProps {
  webAppMapperId: number | null;
  setWebAppMapperId: (webAppMapperId: number | null) => void;
}
const useWebAppMappersIdStore = create<useWebAppMappersIdStoreProps>((set) => ({
  webAppMapperId: null,
  setWebAppMapperId: (newWebAppMapperId) =>
    set(() => ({ webAppMapperId: newWebAppMapperId })),
}));

export default useWebAppMappersIdStore;
