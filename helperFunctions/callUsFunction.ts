import { CallUsResponseType } from "@/types/callUsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchCallUsListProps {
  startDate: string;
  endDate: string;
}

export const fetchCallUsList = async ({
  startDate,
  endDate,
}: fetchCallUsListProps): Promise<CallUsResponseType | null> => {

  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/call-us-data/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching call us list:", err);
    return null;
  }
};

export const fetchAllCallUsList =
  async (): Promise<CallUsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/call-us-data/all",
      });

      return response;
    } catch (err) {
      console.error("Error fetching call us list:", err);
      return null;
    }
  };

export const fetchSingleCallUs = async (
  callUsId: number
): Promise<CallUsResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/call-us-data/${callUsId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single call us:", err);
    return null;
  }
};
