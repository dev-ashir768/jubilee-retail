import {
  PaymentModesResponseType
} from "@/types/paymentModesTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchPaymentModesList =
  async (): Promise<PaymentModesResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/payment-modes",
      });

      return response;
    } catch (err) {
      console.error("Error fetching payment modes list:", err);
      return null;
    }
  };

  export const fetchSinglePaymentModesList =
  async (paymentModesId: number): Promise<PaymentModesResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/payment-modes/single",
        data: { payment_mode_id: paymentModesId },
      });

      return response;
    } catch (err) {
      console.error("Error fetching single payment mode list:", err);
      return null;
    }
  };