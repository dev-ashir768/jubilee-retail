"use client";

import SubNav from "../foundations/sub-nav";
import KPICards from "./kpi-cards";
import {
  fetchApiUsersByPolicyAmount,
  fetchMonthlyPolicyNOrders,
  fetchPaymentMode,
  fetchPolicyStats,
  fetchPolicyStatusBreakdown,
  fetchProductsByProductAmount,
  fetchProductsDetailWise,
  fetchProductShareOfPolicyAmountByAmount,
  fetchRecentOrders,
  fetchTop5Agents,
  fetchTop5Branches,
} from "@/helperFunctions/dashboardFunctions";
import {
  ApiUsersByPolicyAmountResponse,
  MonthlyPolicyNOrdersResponse,
  PaymentModeResponse,
  PolicyStatsResponse,
  PolicyStatusBreakdownResponse,
  ProductsByProductAmountResponse,
  ProductsDetailWiseResponse,
  ProductShareOfPolicyAmountByAmountResponse,
  RecentOrdersResponse,
  Top5AgentsResponse,
  Top5BranchesResponse,
} from "@/types/dashboardTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import ProductsDetailWise from "./products-detail-wise";
import ApiUsersByPolicyAmount from "./api-users-by-policy-amount";
import ProductsByProductAmount from "./products-by-product-amount";
import PolicyStatusBreakdown from "./policy-status-breakdown";
import MonthlyOrdersAndPolicies from "./monthly-orders-and-policies";
import Top5Agents from "./top-5-agents";
import ProductShareOfPolicyAmountByAmount from "./product-share-of-policy-amount-by-amount";
import RecentOrders from "./recent-orders";
import PaymentMode from "./payment-mode";
import Top5Branches from "./top-5-branches";

export function DashboardWrapper() {
  // ======== CONSTANTS & HOOKS ========
  const pathname = usePathname();
  const router = useRouter();
  const defaultDaysBack = 364;
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), defaultDaysBack),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";

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
    queryKey: [
      "policy-monthly-orders-and-policies",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchMonthlyPolicyNOrders({
        startDate,
        endDate,
      }),
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
    data: productsByProductAmountResponse,
    isLoading: productsByProductAmountLoading,
    isError: productsByProductAmountIsError,
    error: productsByProductAmountError,
  } = useQuery<ProductsByProductAmountResponse | null>({
    queryKey: [
      "top-5-products-by-product-amount",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchProductsByProductAmount({
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
      "top-5-products-by-product-amount",
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
    data: top5AgentsResponse,
    isLoading: top5AgentsLoading,
    isError: top5AgentsIsError,
    error: top5AgentsError,
  } = useQuery<Top5AgentsResponse | null>({
    queryKey: [
      "top-5-agents",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchTop5Agents({
        startDate,
        endDate,
      }),
  });

  const {
    data: recentOrdersResponse,
    isLoading: recentOrdersLoading,
    isError: recentOrdersIsError,
    error: recentOrdersError,
  } = useQuery<RecentOrdersResponse | null>({
    queryKey: [
      "recent-orders",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchRecentOrders({
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

  // ======== PAYLOADS DATA ========
  const policyStats = useMemo(
    () => policyStatsResponse?.payload || [],
    [policyStatsResponse]
  );

  const monthlyPolicyNOrders = useMemo(
    () => monthlyPolicyNOrdersResponse?.payload || [],
    [monthlyPolicyNOrdersResponse]
  );

  const policyStatusBreakdown = useMemo(
    () => policyStatusBreakdownResponse?.payload || [],
    [policyStatusBreakdownResponse]
  );

  const productsDetailWise = useMemo(
    () => productsDetailWiseResponse?.payload || [],
    [productsDetailWiseResponse]
  );

  const productsByProductAmount = useMemo(
    () => productsByProductAmountResponse?.payload || [],
    [productsByProductAmountResponse]
  );

  const apiUsersByPolicyAmount = useMemo(
    () => apiUsersByPolicyAmountResponse?.payload || [],
    [apiUsersByPolicyAmountResponse]
  );

  const top5Agents = useMemo(
    () => top5AgentsResponse?.payload || [],
    [top5AgentsResponse]
  );

  const productShareOfPolicyAmountByAmount = useMemo(
    () => productShareOfPolicyAmountByAmountResponse?.payload || [],
    [productShareOfPolicyAmountByAmountResponse]
  );

  const recentOrders = useMemo(
    () => recentOrdersResponse?.payload || [],
    [recentOrdersResponse]
  );

  const paymentMode = useMemo(
    () => paymentModeResponse?.payload || [],
    [paymentModeResponse]
  );

  const top5Branches = useMemo(
    () => top5BranchesResponse?.payload || [],
    [top5BranchesResponse]
  );

  // ======== RENDER LOGIC ========
  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  return (
    <>
      <SubNav
        title="Dashboard"
        datePicker={true}
        setDateRange={setDateRange}
        dateRange={dateRange}
        defaultDaysBack={defaultDaysBack}
      />

      <div className="grid grid-cols-1 gap-6">
        <KPICards
          policyStats={policyStats}
          isLoading={policyStatsLoading}
          isError={policyStatsIsError}
          error={policyStatsError?.message ?? "Error Occur"}
        />

        <Top5Branches
          payload={top5Branches}
          isLoading={top5BranchesLoading}
          isError={top5BranchesIsError}
          error={top5BranchesError?.message ?? "Error Occur"}
        />

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
            error={productShareOfPolicyAmountByAmountError?.message ?? "Error Occur"}
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
          <ApiUsersByPolicyAmount
            payload={apiUsersByPolicyAmount}
            isLoading={apiUsersByPolicyAmountLoading}
            isError={apiUsersByPolicyAmountIsError}
            error={apiUsersByPolicyAmountError?.message ?? "Error Occur"}
          />

          <ProductsDetailWise
            payload={productsDetailWise}
            isLoading={productsDetailWiseLoading}
            isError={productsDetailWiseIsError}
            error={productsDetailWiseError?.message ?? "Error Occur"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentMode
            payload={paymentMode}
            isLoading={paymentModeLoading}
            isError={paymentModeIsError}
            error={paymentModeError?.message ?? "Error Occur"}
          />
          <Top5Agents
            payload={top5Agents}
            isLoading={top5AgentsLoading}
            isError={top5AgentsIsError}
            error={top5AgentsError?.message ?? "Error Occur"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductsByProductAmount
            payload={productsByProductAmount}
            isLoading={productsByProductAmountLoading}
            isError={productsByProductAmountIsError}
            error={productsByProductAmountError?.message ?? "Error Occur"}
          />
          <RecentOrders
            payload={recentOrders}
            isLoading={recentOrdersLoading}
            isError={recentOrdersIsError}
            error={recentOrdersError?.message ?? "Error Occur"}
          />
        </div>
      </div>
    </>
  );
}
