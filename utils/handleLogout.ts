import { deleteCookie } from "cookies-next";
const handleLogout = () => {
  deleteCookie("jubilee-retail-token");
  deleteCookie("userInfo");
  deleteCookie("menus");
  window.location.href = "/login";
};

export default handleLogout;
