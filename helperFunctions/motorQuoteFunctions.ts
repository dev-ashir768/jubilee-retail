import { MotorQuoteResponseTypes } from "@/types/motorQuote";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchMotorQuoteList = async (): Promise<MotorQuoteResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/motor-quotes/all",
    });

    return response;
  } catch (err) {
    console.error("Error fetching motor quotes list:", err);
    return null;
  }
};

export const fetchSingleMotorQuote = async (
  motorQuoteId: number
): Promise<MotorQuoteResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/motor-quotes/single`,
      data: { id: motorQuoteId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching motor quote:", err);
    return null;
  }
};
