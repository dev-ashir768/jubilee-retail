import { CouponsResponseType } from "@/types/couponsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchCouponsListProps {
  startDate: string;
  endDate: string;
}

export const fetchCouponsList = async ({
  startDate,
  endDate,
}: fetchCouponsListProps): Promise<CouponsResponseType | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/coupons/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching coupons list:", err);
    return null;
  }
};

export const fetchAllCouponsList =
  async (): Promise<CouponsResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/coupons/all",
      });

      return response;
    } catch (err) {
      console.error("Error fetching coupons list:", err);
      return null;
    }
  };
