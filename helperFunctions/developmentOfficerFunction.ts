import { axiosFunction } from "@/utils/axiosFunction";

export const fetchDevelopmentOfficerList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/development-officers",
    });

    return response;
  } catch (err) {
    console.error("Error fetching development-officers list:", err);
    return null;
  }
};
