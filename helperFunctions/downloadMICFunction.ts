import { axiosFunction } from "@/utils/axiosFunction";

export const downloadMIS = () => {
  try {
    const response = axiosFunction({
      method: "POST",
      urlPath: "/reportings/mis-internal",
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error: while donwlaoding MIS Report", error);
    throw error;
  }
};
