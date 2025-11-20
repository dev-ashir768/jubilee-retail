import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

export const handleLogout = () => {
  const queryClient = useQueryClient();
  queryClient.clear();
  deleteCookie("jubilee-retail-token");
  deleteCookie("userInfo");
  localStorage.removeItem("menus");
};
