import { axiosFunction } from "@/utils/axiosFunction";

export const fetchUsersList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/users",
    });

    return response;
  } catch (error: any) {
    console.error("Error fetching users list:", error);
    return null;
  }
};
