import { IgisMakeResponseType } from "@/types/igisTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchIgisMakeList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/igis-makes",
    });
    return response;
  } catch (err) {
    console.error("Error fetching igis makes list:", err);
    return null;
  }
};

export const fetchSingleIgisMake = async (
  IgisMakeId: number
): Promise<IgisMakeResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/igis-makes/${IgisMakeId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single igis makes:", err);
    return null;
  }
};

export const fetchIgisSubMakeList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/igis-sub-makes",
    });
    return response;
  } catch (err) {
    console.error("Error fetching igis sub makes list:", err);
    return null;
  }
};

export const fetchSingleIgisSubMake = async (
  IgisSubMakeId: number
): Promise<IgisMakeResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/igis-sub-makes/${IgisSubMakeId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single igis sub makes:", err);
    return null;
  }
};
