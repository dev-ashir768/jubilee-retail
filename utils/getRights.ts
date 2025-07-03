import { getCookie } from "cookies-next";
import { menusTypes } from "@/types/verifyOtpTypes";

export const getRights = (pathname: string | null) => {
  const isMenus = getCookie("menus")?.toString();
  const menusFromCookies = isMenus ? (JSON.parse(isMenus) as menusTypes[]) : [];
  const menu = menusFromCookies.find((item) => item.url === pathname);
  return menu as menusTypes;
};
