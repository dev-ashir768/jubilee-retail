"use client";

import { menusTypes } from "@/types/verifyOtpTypes";

export const getRights = (pathname: string | null) => {
  const isMenus = localStorage.getItem("menus")?.toString();

  const menusFromCookies = isMenus ? (JSON.parse(isMenus) as menusTypes[]) : [];
  const menu = menusFromCookies.find((item) => item.url === pathname);
  return menu as menusTypes;
};
