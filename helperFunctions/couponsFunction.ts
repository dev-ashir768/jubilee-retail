import { CouponsResponseType } from "@/types/couponsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchCouponsListProps {
  startDate: string;
  endDate: string;
  product_id: number[] | null;
}

export const fetchCouponsList = async ({
  startDate,
  endDate,
  product_id,
}: fetchCouponsListProps): Promise<CouponsResponseType | null> => {
  const payload = { date: `${startDate} to ${endDate}`, product_id };

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
