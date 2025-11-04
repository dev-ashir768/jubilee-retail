"use client";

import { RevenueTrendChart } from "./revenue-trend-chart";
import { PerformanceSparklineChart } from "./performance-sparkline-chart";
import SubNav from "../foundations/sub-nav";
import KPICards from "./kpi-cards";
import {
  fetchApiUsersByPolicyAmount,
  fetchMonthlyPolicyNOrders,
  fetchPolicyStats,
  fetchPolicyStatusBreakdown,
  fetchProductsByProductAmount,
  fetchProductsDetailWise,
} from "@/helperFunctions/dashboardFunctions";
import {
  ApiUsersByPolicyAmountResponse,
  MonthlyPolicyNOrdersResponse,
  PolicyStatsResponse,
  PolicyStatusBreakdownResponse,
  ProductsByProductAmountResponse,
  ProductsDetailWiseResponse,
} from "@/types/dashboardTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import LoadingState from "../foundations/loading-state";
import ProductsDetailWise from "./products-detail-wise";
import ApiUsersByPolicyAmount from "./api-users-by-policy-amount";
import ProductsByProductAmount from "./products-by-product-amount";
import PolicyStatusBreakdown from "./policy-status-breakdown";
import MonthlyOrdersAndPolicies from "./monthly-orders-and-policies";

export function DashboardWrapper() {
  // ======== CONSTANTS & HOOKS ========
  const pathname = usePathname();
  const router = useRouter();
  const defaultDaysBack = 366;
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 364),
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
    // isError: policyStatsIsError,
    // error: policyStatsError,
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
    // isError: monthlyPolicyNOrdersIsError,
    // error: monthlyPolicyNOrdersError,
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
    // isError: productsDetailWiseIsError,
    // error: productsDetailWiseError,
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
    // isError: productsByProductAmountIsError,
    // error: productsByProductAmountError,
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
    // isError: apiUsersByPolicyAmountIsError,
    // error: apiUsersByPolicyAmountError,
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
    // isError: policyStatusBreakdownIsError,
    // error: policyStatusBreakdownError,
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

  // ======== RENDER LOGIC ========
  const isLoading =
    policyStatsLoading ||
    monthlyPolicyNOrdersLoading ||
    productsDetailWiseLoading;
  // const isError = policyStatsIsError || monthlyPolicyNOrdersIsError || productsDetailWiseIsError;
  // const onError = policyStatsError?.message || monthlyPolicyNOrdersError?.message || productsDetailWiseError?.message;

  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (isLoading) {
    return <LoadingState />;
  }

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
        <KPICards policyStats={policyStats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <PoliciesClaimsChart /> */}
          <ProductsDetailWise payload={productsDetailWise} />

          <ProductsByProductAmount payload={productsByProductAmount} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApiUsersByPolicyAmount payload={apiUsersByPolicyAmount} />

          <PolicyStatusBreakdown payload={policyStatusBreakdown} />
        </div>

        <div className="grid grid-cols-1  gap-6">
          {/* <RevenueTrendChart /> */}

          <MonthlyOrdersAndPolicies payload={monthlyPolicyNOrders} />
        </div>
      </div>
    </>
  );
}
