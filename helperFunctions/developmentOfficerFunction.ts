import { DevelopmentOfficerResponseTypes } from "@/types/developmentOfficerTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchDevelopmentOfficerListProps {
  startDate: string;
  endDate: string;
}

export const fetchDevelopmentOfficerList = async ({
  startDate,
  endDate,
}: fetchDevelopmentOfficerListProps): Promise<DevelopmentOfficerResponseTypes | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/development-officers/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching development-officers list:", err);
    return null;
  }
};

export const fetchAllDevelopmentOfficerList =
  async (): Promise<DevelopmentOfficerResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/development-officers/all",
        data: {},
      });

      return response;
    } catch (err) {
      console.error("Error fetching development-officers list:", err);
      return null;
    }
  };

export const fetchSingleDevelopmentOfficer = async (
  developmentOfficerId: number
): Promise<DevelopmentOfficerResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/development-officers/${developmentOfficerId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single development officers:", err);
    return null;
  }
};
