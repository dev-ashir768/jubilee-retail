import { userInfoTypes } from "@/types/verifyOtpTypes";
import { getCookie } from "cookies-next";

export const getUserInfo = () => {
  const userInfo = getCookie("userInfo");
  if (userInfo) {
    return JSON.parse(userInfo.toString()) as userInfoTypes;
  }
  return null;
};