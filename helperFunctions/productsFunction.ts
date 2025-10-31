import { ProductsResponseTypes } from "@/types/productsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchProductsListProps {
  startDate: string;
  endDate: string;
}

export const fetchProductsList = async ({
  startDate,
  endDate,
}: fetchProductsListProps): Promise<ProductsResponseTypes | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/products/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching products list:", err);
    return null;
  }
};

export const fetchAllProductsList =
  async (): Promise<ProductsResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/products/all",
      });

      return response;
    } catch (err) {
      console.error("Error fetching products list:", err);
      return null;
    }
  };

export const fetchSingleProducts = async (
  productsId: number
): Promise<ProductsResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/products/single`,
      data: { id: productsId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching single products:", err);
    return null;
  }
};
