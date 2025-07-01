import { create } from "zustand";
import { menusTypes } from "@/types/verifyOtpTypes";

interface MenusStore {
  menus: menusTypes[];
  setMenus: (menus: menusTypes[]) => void;
}

export const useMenusStore = create<MenusStore>((set) => ({
  menus: [],
  setMenus: (newMenus) => set(() => ({ menus: newMenus })),
}));
