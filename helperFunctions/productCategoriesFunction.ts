import { ProductCategoriesResponseTypes } from "@/types/productCategoriesTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchProductCategoriesList =
  async (): Promise<ProductCategoriesResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/product-categories",
      });

      return response;
    } catch (err) {
      console.error("Error fetching product category list:", err);
      return null;
    }
  };

export const fetchSingleProductCategory = async (
  productCategoryId: number
): Promise<ProductCategoriesResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/product-categories/single`,
      data: { id: productCategoryId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching single product category:", err);
    return null;
  }
};
