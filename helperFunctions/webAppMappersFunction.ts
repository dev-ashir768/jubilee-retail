import { WebAppMappersResponseTypes } from "@/types/webAppMappersTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchWebAppMappersList =
  async (): Promise<WebAppMappersResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/web-app-mappers",
      });

      return response;
    } catch (err) {
      console.error("Error fetching web app mappers list:", err);
      return null;
    }
  };

export const fetchSingleWebAppMappers = async (
  webAppMapperId: number
): Promise<WebAppMappersResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/web-app-mappers/single`,
      data: { id: webAppMapperId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching product types:", err);
    return null;
  }
};
