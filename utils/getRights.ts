import { useMenusStore } from "./../hooks/useMenus";
import { menusTypes } from "@/types/verifyOtpTypes";

const getRights = (pathname: menusTypes | null) => {
  const { menus } = useMenusStore();
  const menu = menus.find((item: any) => item.url === pathname);
  return menu as menusTypes;
};

export default getRights;
