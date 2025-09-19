"use client";

import { menusTypes } from "@/types/verifyOtpTypes";

export const getRights = (pathname: string | null) => {
  // ✅ Ensure code only runs in the browser
  if (typeof window === "undefined") {
    return null; // Prevent SSR crash
  }

  // Get menus from localStorage
  const isMenus = localStorage.getItem("menus");

  if (!isMenus) {
    return null; // If nothing is stored, return null safely
  }

  try {
    const menusFromLocalStorage = JSON.parse(isMenus) as menusTypes[];
    const menu = menusFromLocalStorage.find((item) => item.url === pathname);

    return menu || null; // Return menu or null if not found
  } catch (error) {
    console.error("Error parsing menus from localStorage:", error);
    return null;
  }
};


// "use client";
// import { menusTypes } from "@/types/verifyOtpTypes";
// export const getRights = (pathname: string | null) => {
//   const isMenus = localStorage.getItem("menus")?.toString();
//    const menusFromCookies = isMenus ? (JSON.parse(isMenus) as menusTypes[]) : [];
//    const menu = menusFromCookies.find((item) => item.url === pathname);
//    return menu as menusTypes;  };