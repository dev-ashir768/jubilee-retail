import { ClientResponseType } from "@/types/clientTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchClientListProps {
  startDate: string;
  endDate: string;
}

export const fetchClientList = async <T>({
  startDate,
  endDate,
}: fetchClientListProps): Promise<ClientResponseType | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/clients/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching clients list:", err);
    return null;
  }
};

export const fetchAllClientList =
  async (): Promise<ClientResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/clients/all",
      });

      return response;
    } catch (err) {
      console.error("Error fetching clients list:", err);
      return null;
    }
  };

export const fetchSingleClient = async (
  clientId: number
): Promise<ClientResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/clients/${clientId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single clients", err);
    return null;
  }
};
