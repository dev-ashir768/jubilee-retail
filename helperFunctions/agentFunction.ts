import { AgentResponseTypes } from "@/types/agentTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchAgentListProps {
  startDate: string;
  endDate: string;
}

export const fetchAgentList = async ({
  startDate,
  endDate,
}: fetchAgentListProps): Promise<AgentResponseTypes | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/agents/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching agents list:", err);
    return null;
  }
};

export const fetchAllAgentList =
  async (): Promise<AgentResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/agents/all",
      });

      return response;
    } catch (err) {
      console.error("Error fetching agents list:", err);
      return null;
    }
  };

export const fetchSingleAgent = async (
  agentId: number
): Promise<AgentResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/agents/${agentId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single agent:", err);
    return null;
  }
};
