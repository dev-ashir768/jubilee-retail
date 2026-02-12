"use client";

import SubNav from "../foundations/sub-nav";
import KPICards from "./kpi-cards";
import {
  fetchApiUsersByPolicyAmount,
  fetchCouponUsage,
  fetchMonthlyPolicyNOrders,
  fetchPaymentMode,
  fetchPolicyStats,
  fetchPolicyStatusBreakdown,
  fetchProductsDetailWise,
  fetchProductShareOfPolicyAmountByAmount,
  fetchTop5Branches,
} from "@/helperFunctions/dashboardFunctions";
import {
  ApiUsersByPolicyAmountResponse,
  CouponUsageResponse,
  MonthlyPolicyNOrdersResponse,
  PaymentModeResponse,
  PolicyStatsResponse,
  PolicyStatusBreakdownResponse,
  ProductsDetailWiseResponse,
  ProductShareOfPolicyAmountByAmountResponse,
  Top5BranchesResponse,
} from "@/types/dashboardTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import ProductsDetailWise from "./products-detail-wise";
import ApiUsersByPolicyAmount from "./api-users-by-policy-amount";
import PolicyStatusBreakdown from "./policy-status-breakdown";
import MonthlyOrdersAndPolicies from "./monthly-orders-and-policies";
import ProductShareOfPolicyAmountByAmount from "./product-share-of-policy-amount-by-amount";
import PaymentMode from "./payment-mode";
import Top5Branches from "./top-5-branches";
import Empty from "../foundations/empty";
import { userInfoTypes } from "@/types/verifyOtpTypes";
import { getCookie } from "cookies-next";
import CouponUsage from "./coupon-usage";
import { getUserInfo } from "@/utils/getUserInfo";

export function DashboardWrapper() {
  // ======== CONSTANTS & HOOKS ========
  const pathname = usePathname();
  const userInfo = getUserInfo();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";

  const userInfoFromCookie: userInfoTypes = useMemo(() => {
    return JSON.parse(getCookie("userInfo")?.toString() || "{}");
  }, []);

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // ======== DATA FETCHING ========
  const {
    data: policyStatsResponse,
    isLoading: policyStatsLoading,
    isError: policyStatsIsError,
    error: policyStatsError,
  } = useQuery<PolicyStatsResponse | null>({
    queryKey: [
      "policy-stats",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchPolicyStats({
        startDate,
        endDate,
      }),
  });

  const {
    data: monthlyPolicyNOrdersResponse,
    isLoading: monthlyPolicyNOrdersLoading,
    isError: monthlyPolicyNOrdersIsError,
    error: monthlyPolicyNOrdersError,
  } = useQuery<MonthlyPolicyNOrdersResponse | null>({
    queryKey: ["policy-monthly-orders-and-policies"],
    queryFn: () => fetchMonthlyPolicyNOrders(),
  });

  const {
    data: productsDetailWiseResponse,
    isLoading: productsDetailWiseLoading,
    isError: productsDetailWiseIsError,
    error: productsDetailWiseError,
  } = useQuery<ProductsDetailWiseResponse | null>({
    queryKey: [
      "top-5-products-detail-wise",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchProductsDetailWise({
        startDate,
        endDate,
      }),
  });

  const {
    data: apiUsersByPolicyAmountResponse,
    isLoading: apiUsersByPolicyAmountLoading,
    isError: apiUsersByPolicyAmountIsError,
    error: apiUsersByPolicyAmountError,
  } = useQuery<ApiUsersByPolicyAmountResponse | null>({
    queryKey: [
      "top-5-api-user-by-policy-amount",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchApiUsersByPolicyAmount({
        startDate,
        endDate,
      }),
  });

  const {
    data: policyStatusBreakdownResponse,
    isLoading: policyStatusBreakdownLoading,
    isError: policyStatusBreakdownIsError,
    error: policyStatusBreakdownError,
  } = useQuery<PolicyStatusBreakdownResponse | null>({
    queryKey: [
      "policy-status-breakdown-valid-invalid",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchPolicyStatusBreakdown({
        startDate,
        endDate,
      }),
  });

  const {
    data: productShareOfPolicyAmountByAmountResponse,
    isLoading: productShareOfPolicyAmountByAmountLoading,
    isError: productShareOfPolicyAmountByAmountIsError,
    error: productShareOfPolicyAmountByAmountError,
  } = useQuery<ProductShareOfPolicyAmountByAmountResponse | null>({
    queryKey: [
      "product-share-of-policy-amount-by-amount",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchProductShareOfPolicyAmountByAmount({
        startDate,
        endDate,
      }),
  });

  const {
    data: paymentModeResponse,
    isLoading: paymentModeLoading,
    isError: paymentModeIsError,
    error: paymentModeError,
  } = useQuery<PaymentModeResponse | null>({
    queryKey: [
      "payment-mode",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchPaymentMode({
        startDate,
        endDate,
      }),
  });

  const {
    data: top5BranchesResponse,
    isLoading: top5BranchesLoading,
    isError: top5BranchesIsError,
    error: top5BranchesError,
  } = useQuery<Top5BranchesResponse | null>({
    queryKey: [
      "top-5-branches",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchTop5Branches({
        startDate,
        endDate,
      }),
  });

  const {
    data: couponUsageResponse,
    isLoading: couponUsageLoading,
    isError: couponUsageIsError,
    error: couponUsageError,
  } = useQuery<CouponUsageResponse | null>({
    queryKey: [
      "coupon-usage",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchCouponUsage({
        startDate,
        endDate,
      }),
  });

  // ======== PAYLOADS DATA ========
  const policyStats = useMemo(
    () => policyStatsResponse?.payload || [],
    [policyStatsResponse],
  );

  const monthlyPolicyNOrders = useMemo(
    () => monthlyPolicyNOrdersResponse?.payload || [],
    [monthlyPolicyNOrdersResponse],
  );

  const policyStatusBreakdown = useMemo(
    () => policyStatusBreakdownResponse?.payload || [],
    [policyStatusBreakdownResponse],
  );

  const productsDetailWise = useMemo(
    () => productsDetailWiseResponse?.payload || [],
    [productsDetailWiseResponse],
  );

  const apiUsersByPolicyAmount = useMemo(
    () => apiUsersByPolicyAmountResponse?.payload || [],
    [apiUsersByPolicyAmountResponse],
  );

  const productShareOfPolicyAmountByAmount = useMemo(
    () => productShareOfPolicyAmountByAmountResponse?.payload || [],
    [productShareOfPolicyAmountByAmountResponse],
  );

  const paymentMode = useMemo(
    () => paymentModeResponse?.payload || [],
    [paymentModeResponse],
  );

  const top5Branches = useMemo(
    () => top5BranchesResponse?.payload || [],
    [top5BranchesResponse],
  );

  const couponUsage = useMemo(
    () => couponUsageResponse?.payload || [],
    [couponUsageResponse],
  );

  // ======== RENDER LOGIC ========
  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect(userInfo?.redirection_url ? userInfo.redirection_url : "/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, userInfo]);

  if ((rights && rights?.can_view === "0") || !rights?.can_view)
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav
        title="Dashboard"
        datePicker={true}
        setDateRange={setDateRange}
        dateRange={dateRange}
      />

      <div className="grid grid-cols-1 gap-6">
        <KPICards
          policyStats={policyStats}
          isLoading={policyStatsLoading}
          isError={policyStatsIsError}
          error={policyStatsError?.message ?? "Error Occur"}
        />

        {userInfoFromCookie?.userType === "dashboard_user" && (
          <Top5Branches
            payload={top5Branches}
            isLoading={top5BranchesLoading}
            isError={top5BranchesIsError}
            error={top5BranchesError?.message ?? "Error Occur"}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PolicyStatusBreakdown
            payload={policyStatusBreakdown}
            isLoading={policyStatusBreakdownLoading}
            isError={policyStatusBreakdownIsError}
            error={policyStatusBreakdownError?.message ?? "Error Occur"}
          />
          <ProductShareOfPolicyAmountByAmount
            payload={productShareOfPolicyAmountByAmount}
            isLoading={productShareOfPolicyAmountByAmountLoading}
            isError={productShareOfPolicyAmountByAmountIsError}
            error={
              productShareOfPolicyAmountByAmountError?.message ?? "Error Occur"
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <MonthlyOrdersAndPolicies
            payload={monthlyPolicyNOrders}
            isLoading={monthlyPolicyNOrdersLoading}
            isError={monthlyPolicyNOrdersIsError}
            error={monthlyPolicyNOrdersError?.message ?? "Error Occur"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userInfoFromCookie?.userType === "dashboard_user" && (
            <ApiUsersByPolicyAmount
              payload={apiUsersByPolicyAmount}
              isLoading={apiUsersByPolicyAmountLoading}
              isError={apiUsersByPolicyAmountIsError}
              error={apiUsersByPolicyAmountError?.message ?? "Error Occur"}
            />
          )}
          <ProductsDetailWise
            payload={productsDetailWise}
            isLoading={productsDetailWiseLoading}
            isError={productsDetailWiseIsError}
            error={productsDetailWiseError?.message ?? "Error Occur"}
          />

          {userInfoFromCookie?.userType === "dashboard_user" && (
            <>
              <PaymentMode
                payload={paymentMode}
                isLoading={paymentModeLoading}
                isError={paymentModeIsError}
                error={paymentModeError?.message ?? "Error Occur"}
              />

              <CouponUsage
                data={couponUsage}
                error={couponUsageError?.message ?? "Error Occur"}
                isError={couponUsageIsError}
                isLoading={couponUsageLoading}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
