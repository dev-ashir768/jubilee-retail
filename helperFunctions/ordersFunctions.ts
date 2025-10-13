import { axiosFunction } from "@/utils/axiosFunction";

interface fetchOrdersListingProps {
  mode: string;
}

export const fetchOrdersListing = async <T>({
  mode,
}: fetchOrdersListingProps): Promise<T | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/orders/list",
      data: {
        mode,
      },
    });

    return response as T;
  } catch (err) {
    console.error(`Error fetching ${mode} list listing:`, err);
    return null;
  }
};
