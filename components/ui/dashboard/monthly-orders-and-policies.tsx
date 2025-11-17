"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { MonthlyPolicyNOrdersPayloadType } from "@/types/dashboardTypes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, startOfMonth } from "date-fns";
import { Skeleton } from "../shadcn/skeleton";
import { formatNumberCell } from "@/utils/numberFormaterFunction";

const CHART_COLORS = {
  orders: "#3b82f6",
  policies: "#10b981",
};

interface MonthlyPoliciesTrendProps {
  payload: MonthlyPolicyNOrdersPayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

const MonthlyPoliciesTrend: React.FC<MonthlyPoliciesTrendProps> = ({
  payload,
  isLoading,
  isError,
  error,
}) => {
  const aggregateMonthly = (dailyData: MonthlyPolicyNOrdersPayloadType[]) => {
    const monthlyMap = new Map<string, { orders: number; policies: number }>();

    dailyData.forEach((entry) => {
      const date = new Date(entry.sale_date);
      const monthKey = format(startOfMonth(date), "yyyy-MM"); // e.g., "2022-09"

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { orders: 0, policies: 0 });
      }

      const monthData = monthlyMap.get(monthKey)!;
      monthData.orders += entry.daily_orders;
      monthData.policies += entry.daily_policies;
    });

    // Sort by month key and transform to chart data
    return Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([monthKey, values]) => ({
        month: monthKey,
        formattedMonth: format(new Date(monthKey + "-01"), "MMM yyyy"),
        orders:  values.orders,
        policies: values.policies,
      }));
  };

  const monthlyData = aggregateMonthly(payload);

  const customTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length && label !== undefined) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md min-w-[150px]">
          <p className="font-medium text-gray-900 mb-2">{String(label)}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} className="text-sm flex justify-between">
              <span className="font-semibold" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span>{formatNumberCell(+entry.value.toLocaleString())}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderSkeleton = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-52 rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <Skeleton className="h-full w-full rounded-sm" />
        </div>
      </CardContent>
    </Card>
  );

  const renderError = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (isError) {
    return renderError();
  }

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>Monthly Orders vs Policies Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.2}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="formattedMonth"
                tick={{ fontSize: 12 }}
                angle={360}
                textAnchor="start"
                height={70}
                interval={Math.floor(monthlyData.length / 12)}
              />
              <YAxis
                tickFormatter={(value) => value.toLocaleString()}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={customTooltip} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="orders"
                name="Monthly Orders"
                stroke={CHART_COLORS.orders}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.orders, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="policies"
                name="Monthly Policies"
                stroke={CHART_COLORS.policies}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.policies, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyPoliciesTrend;
