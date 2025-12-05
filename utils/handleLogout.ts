
import { deleteCookie } from "cookies-next";

export const handleLogout = () => {
  deleteCookie("jubilee-retail-token");
  deleteCookie("userInfo");
  localStorage.clear();
};
