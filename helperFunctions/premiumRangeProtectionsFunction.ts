import {
  PremiumRangeProtectionsResponseType,
} from "@/types/premiumRangeProtectionsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchPremiumRangeProtectionsList =
  async (): Promise<PremiumRangeProtectionsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/premium-range-protections",
      });
      return response || null;
    } catch (err) {
      console.error("Error fetching premium range protections:", err);
      return null;
    }
  };

export const fetchSinglePremiumRangeProtectionsList = async (
  premiumRangeProtectionId: number
): Promise<PremiumRangeProtectionsResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/premium-range-protections/single",
      data: { id: premiumRangeProtectionId },
    });
    return response || null;
  } catch (err) {
    console.error("Error fetching single premium range protection:", err);
    return null;
  }
};
