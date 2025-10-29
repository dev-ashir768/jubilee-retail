"use client";
import { KPICards } from "./kpi-cards";
import { PoliciesClaimsChart } from "./policies-claims-chart";
import { ClaimsDistributionChart } from "./claims-distribution-chart";
import { RevenueByRegionChart } from "./revenue-by-region-chart";
import { PerformanceMetricsChart } from "./performance-metrics-chart";
import { RevenueTrendChart } from "./revenue-trend-chart";
import { PerformanceSparklineChart } from "./performance-sparkline-chart";
import SubNav from "../foundations/sub-nav";

export function DashboardWrapper() {
  return (
    <>
      <SubNav title="Dashboard" />

      <div className="grid grid-cols-1 gap-6">
        {/* KPI Cards with Sparklines */}
        <KPICards />

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
