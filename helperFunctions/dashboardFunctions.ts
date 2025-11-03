import { PolicyStatsResponse } from "@/types/dashboardTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export interface fetchPolicyStatsProps {
  startDate: string;
  endDate: string;
}

export const fetchPolicyStats = async ({
  startDate,
  endDate,
}: fetchPolicyStatsProps): Promise<PolicyStatsResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/policy-stats",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching policy stats:", err);
    return null;
  }
};
