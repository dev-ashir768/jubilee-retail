import { deleteCookie } from "cookies-next";

const logoutFunction = () => {
  deleteCookie("jubilee-retail-token");
  deleteCookie("retail-userInfo");
};

export default logoutFunction;
