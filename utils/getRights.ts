"use client";

import { menusTypes } from "@/types/verifyOtpTypes";

export const getRights = (pathname: string | null): menusTypes | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const isMenus = localStorage.getItem("menus")?.toString();
    
    if (!isMenus) {
      return undefined;
    }

    const menusFromCookies = JSON.parse(isMenus) as menusTypes[];
    const menu = menusFromCookies.find((item) => item.url === pathname);
    
    return menu;
  } catch (error) {
    console.error("Error parsing menus from localStorage:", error);
    return undefined;
  }
};