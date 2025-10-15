import { axiosFunction } from "@/utils/axiosFunction";

interface fetchOrdersListingProps {
  mode: string;
  startDate?: string;
  endDate?: string;
  month?: string | null;
  order_status?: string | null;
}

export const fetchOrdersListing = async <T>({
  mode,
  startDate,
  endDate,
  month,
  order_status,
}: fetchOrdersListingProps): Promise<T | null> => {
  const payload: {
    mode: string;
    date?: string;
    month: string | null;
    order_status: string | null;
  } = {
    mode,
    order_status: order_status ?? null,
    month: month ?? null,
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
