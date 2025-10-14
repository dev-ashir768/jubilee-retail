import { axiosFunction } from "@/utils/axiosFunction";

interface fetchOrdersListingProps {
  mode: string;
  startDate?: string;
  endDate?: string;
}

export const fetchOrdersListing = async <T>({
  mode,
  startDate,
  endDate,
}: fetchOrdersListingProps): Promise<T | null> => {
  const payload: { mode: string; date?: string } = {
    mode,
  };

  if (startDate && endDate) {
    payload.date = `${startDate} to ${endDate}`;
  }

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/orders/list",
      data: payload,
    });

    return response as T;
  } catch (err) {
    console.error(`Error fetching ${mode} list listing:`, err);
    return null;
  }
};
