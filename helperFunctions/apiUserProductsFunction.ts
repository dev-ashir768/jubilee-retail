import {
  ApiUserProductsResponseType,
} from "@/types/apiUserProductsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchApiUserProductsList =
  async (): Promise<ApiUserProductsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/api-user-products/all",
        data: {}
      });

      return response;
    } catch (err) {
      console.error("Error fetching api user products list:", err);
      return null;
    }
  };

export const fetchSingleApiUserProductsList = async (
  apiUserProductsId: number
): Promise<ApiUserProductsResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      data: { api_user_id: apiUserProductsId },
      urlPath: "/api-user-products/single",
    });

    return response;
  } catch (err) {
    console.error("Error fetching api user products list:", err);
    return null;
  }
};
