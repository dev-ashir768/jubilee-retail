import {
  PaymentModesPayloadType,
  PaymentModesResponseType,
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

export const createFilterOptions = (
  data: PaymentModesPayloadType[],
  key: keyof PaymentModesPayloadType
) => {
  if (!data || data.length === 0) return [];

  const uniqueValues = Array.from(new Set(data.map((item) => item[key])));

  return uniqueValues.map((value) => ({
    label: String(value ?? "N/A"),
    value: String(value ?? "N/A"),
  }));
};
