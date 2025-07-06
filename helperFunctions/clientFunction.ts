import { axiosFunction } from "@/utils/axiosFunction";

export const fetchClientList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/clients",
    });

    return response;
  } catch (err) {
    console.error("Error fetching clients list:", err);
    return null;
  }
};
