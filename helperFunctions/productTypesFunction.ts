import { ProductTypeResponseTypes } from "@/types/productTypeTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchProductTypesList =
  async (): Promise<ProductTypeResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/product-types",
      });

      return response;
    } catch (err) {
      console.error("Error fetching product types list:", err);
      return null;
    }
  };

export const fetchProductTypes = async (
  productTypeId: number
): Promise<ProductTypeResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/product-types/single`,
      data: { id: productTypeId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching product types:", err);
    return null;
  }
};
