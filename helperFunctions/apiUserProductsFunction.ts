import {
  ApiUserProductsPayloadType,
  ApiUserProductsResponseType,
} from "@/types/apiUserProductsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchApiUserProductsList =
  async (): Promise<ApiUserProductsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/api-user-products",
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

export const createFilterOptions = (
  data: ApiUserProductsPayloadType[],
  key: keyof ApiUserProductsPayloadType
) => {
  if (!data || data.length === 0) return [];

  const uniqueValues = Array.from(new Set(data.map((item) => item[key])));

  return uniqueValues.map((value) => ({
    label: String(value ?? "N/A"),
    value: String(value ?? "N/A"),
  }));
};
