import {
  BranchResponseTypes
} from "@/types/branchTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchBranchList =
  async (): Promise<BranchResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/branches",
      });

      return response;
    } catch (err) {
      console.error("Error fetching branches list:", err);
      return null;
    }
  };

export const fetchSingleBranch = async (
  branchId: number
): Promise<BranchResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/branches/${branchId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single branch:", err);
    return null;
  }
};
