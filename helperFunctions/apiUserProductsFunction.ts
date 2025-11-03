import { ApiUserProductsResponseType } from "@/types/apiUserProductsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchApiUserProductsListProps {
  startDate: string;
  endDate: string;
  api_user_id: number[];
}

export const fetchApiUserProductsList = async <T>({
  startDate,
  endDate,
  api_user_id,
}: fetchApiUserProductsListProps): Promise<ApiUserProductsResponseType | null> => {
  const payload = { date: `${startDate} to ${endDate}`, api_user_id };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/api-user-products/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching api user products list:", err);
    return null;
  }
};

export const fetchAllApiUserProductsList =
  async (): Promise<ApiUserProductsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/api-user-products/all",
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
