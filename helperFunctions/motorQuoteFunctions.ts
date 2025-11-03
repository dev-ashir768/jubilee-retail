import { MotorQuoteFilterSchemaType } from "@/schemas/motorQuoteSchema";
import { MotorQuoteResponseTypes } from "@/types/motorQuote";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchMotorQuoteListProps {
  startDate: string;
  endDate: string;
  status: string[];
}

export const fetchMotorQuoteList = async <T>({
  startDate,
  endDate,
  status,
}: fetchMotorQuoteListProps): Promise<MotorQuoteResponseTypes | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
    status: status || null,
  };
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/motor-quotes/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching motor quotes list:", err);
    return null;
  }
};

export const fetchAllMotorQuoteList =
  async (): Promise<MotorQuoteResponseTypes | null> => {
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
