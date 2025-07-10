import { axiosFunction } from "@/utils/axiosFunction";

export const fetchIgisMakeList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/igis-makes",
    });
    return response;
  } catch (err) {
    console.error("Error fetching igis makes list:", err);
    return null;
  }
};

export const fetchIgisSubMakeList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/igis-sub-makes",
    });
    return response;
  } catch (err) {
    console.error("Error fetching igis sub makes list:", err);
    return null;
  }
};