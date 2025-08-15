import { ProductOptionsResponseTypes } from "@/types/productOptionsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchProductOptionsList =
  async (): Promise<ProductOptionsResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/product-options",
      });

      return response;
    } catch (err) {
      console.error("Error fetching product options list:", err);
      return null;
    }
  };

export const fetchSingleProductOptions = async (
  productOptionsId: number
): Promise<ProductOptionsResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/product-options/single`,
      data: { id: productOptionsId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching product options:", err);
    return null;
  }
};
