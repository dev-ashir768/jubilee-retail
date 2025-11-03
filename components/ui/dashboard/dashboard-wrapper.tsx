"use client";

import { PoliciesClaimsChart } from "./policies-claims-chart";
import { ClaimsDistributionChart } from "./claims-distribution-chart";
import { RevenueByRegionChart } from "./revenue-by-region-chart";
import { PerformanceMetricsChart } from "./performance-metrics-chart";
import { RevenueTrendChart } from "./revenue-trend-chart";
import { PerformanceSparklineChart } from "./performance-sparkline-chart";
import SubNav from "../foundations/sub-nav";
import KPICards from "./kpi-cards";
import { fetchPolicyStats } from "@/helperFunctions/dashboardFunctions";
import { PolicyStatsResponse } from "@/types/dashboardTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import LoadingState from "../foundations/loading-state";

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

  // ======== PAYLOADS DATA ========
  const policyStats = useMemo(
    () => policyStatsResponse?.payload || [],
    [policyStatsResponse]
  );

  // ======== RENDER LOGIC ========
  const isLoading = policyStatsLoading;
  // const isError = policyStatsIsError;
  // const onError = policyStatsError?.message;

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
        {/* KPI Cards with Sparklines */}
        <KPICards
          policyStats={policyStats}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Policies Trend */}
          <PoliciesClaimsChart />

          {/* Donut Chart - Claims by Type */}
          <ClaimsDistributionChart />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Revenue by Region */}
          <RevenueByRegionChart />

          {/* Half Donut Chart - Performance Metrics */}
          <PerformanceMetricsChart />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart - Revenue Trend */}
          <RevenueTrendChart />

          {/* Sparkline Chart */}
          <PerformanceSparklineChart />
        </div>
      </div>
    </>
  );
}
