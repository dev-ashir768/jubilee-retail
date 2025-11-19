import { ProductPlansResponseTypes } from "@/types/productPlansTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchProductPlansList =
  async (): Promise<ProductPlansResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/api-user-products/single/Internal",
      });

      return response;
    } catch (err) {
      console.error("Error fetching product plans list:", err);
      return null;
    }
  };
