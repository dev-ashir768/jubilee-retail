import { BranchResponseType } from "@/types/branchTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchBranchListProps {
  startDate: string;
  endDate: string;
}

export const fetchBranchList = async <T>({
  startDate,
  endDate,
}: fetchBranchListProps): Promise<BranchResponseType | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/branches/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching branches list:", err);
    return null;
  }
};

export const fetchAllBranchList =
  async (): Promise<BranchResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/branches/all",
      });

      return response;
    } catch (err) {
      console.error("Error fetching branches list:", err);
      return null;
    }
  };

export const fetchSingleBranch = async (
  branchId: number
): Promise<BranchResponseType | null> => {
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
