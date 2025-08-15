import { PlanResponseTypes } from "@/types/planTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchPlansList = async (): Promise<PlanResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/plans",
    });

    return response;
  } catch (err) {
    console.error("Error fetching plans list:", err);
    return null;
  }
};

export const fetchSinglePlan = async (
  planId: number
): Promise<PlanResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/plans/single`,
      data: { id: planId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching plans:", err);
    return null;
  }
};
