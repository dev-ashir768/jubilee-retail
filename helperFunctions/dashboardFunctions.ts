import {
  ApiUsersByPolicyAmountResponse,
  CouponUsageResponse,
  MonthlyPolicyNOrdersResponse,
  PaymentModeResponse,
  PolicyStatsResponse,
  PolicyStatusBreakdownResponse,
  ProductsByProductAmountResponse,
  ProductsDetailWiseResponse,
  ProductShareOfPolicyAmountByAmountResponse,
  Top5BranchesResponse,
} from "@/types/dashboardTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export interface dashboardFunctionProps {
  startDate: string;
  endDate: string;
}

export const fetchPolicyStats = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<PolicyStatsResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/policy-stats",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching policy stats:", err);
    return null;
  }
};

export const fetchMonthlyPolicyNOrders =
  async (): Promise<MonthlyPolicyNOrdersResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/dashboard/monthly-orders-and-policies",
      });

      return response;
    } catch (err) {
      console.error("Error fetching monthly orders and policies:", err);
      return null;
    }
  };

export const fetchProductsDetailWise = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<ProductsDetailWiseResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/top-5-products-detail-wise",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching top 5 products detail wise:", err);
    return null;
  }
};

export const fetchProductsByProductAmount = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<ProductsByProductAmountResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/top-5-products-by-product-amount",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching top 5 products by product amount:", err);
    return null;
  }
};

export const fetchApiUsersByPolicyAmount = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<ApiUsersByPolicyAmountResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/top-5-api-users-by-policy-amount",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching top 5 api users by policy amount:", err);
    return null;
  }
};

export const fetchPolicyStatusBreakdown = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<PolicyStatusBreakdownResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/policy-status-breakdown-valid-invalid",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching policy status breakdown valid invalid:", err);
    return null;
  }
};

export const fetchProductShareOfPolicyAmountByAmount = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<ProductShareOfPolicyAmountByAmountResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/product-share-of-policy-amount-by-amount",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error(
      "Error fetching product share of policy amount by amount:",
      err
    );
    return null;
  }
};

export const fetchPaymentMode = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<PaymentModeResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/payment-mode",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching payment mode:", err);
    return null;
  }
};

export const fetchTop5Branches = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<Top5BranchesResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/top-5-branches",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching top 5 branches:", err);
    return null;
  }
};

export const fetchCouponUsage = async ({
  startDate,
  endDate,
}: dashboardFunctionProps): Promise<CouponUsageResponse | null> => {
  const payload = {
    date: `${startDate} to ${endDate}`,
  };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/dashboard/coupon-usage",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching coupon usage:", err);
    return null;
  }
};
