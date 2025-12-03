import { CommunicationLogsResponseType } from "@/types/communicationLogsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchCommunicationLogsListProps {
  startDate: string;
  endDate: string;
}

export const fetchCommunicationLogsList = async ({
  startDate,
  endDate,
}: fetchCommunicationLogsListProps): Promise<CommunicationLogsResponseType | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/communication-logs/",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching communication logs list:", err);
    return null;
  }
};

export const fetchAllCommunicationLogsList =
  async (): Promise<CommunicationLogsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/communication-logs/",
      });

      return response;
    } catch (err) {
      console.error("Error fetching communication logs list:", err);
      return null;
    }
  };

export const fetchSingleCommunicationLog = async (
  communicationLogId: number
): Promise<CommunicationLogsResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/communication-logs/${communicationLogId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single communication log:", err);
    return null;
  }
};