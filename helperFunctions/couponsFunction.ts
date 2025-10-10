import { CouponsResponseType } from "@/types/couponsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchCouponsList =
  async (): Promise<CouponsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/coupons",
      });

      return response;
    } catch (err) {
      console.error("Error fetching coupons list:", err);
      return null;
    }
  };
