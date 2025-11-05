"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { PolicyStatsPayloadType } from "@/types/dashboardTypes";
import { NumberFormaterFunction } from "@/utils/numberFormaterFunction";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

const sparklineMockData = [
  { value: 40 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
  { value: 55 },
  { value: 70 },
  { value: 75 },
  { value: 85 },
];

interface KPICardsProps {
  policyStats: PolicyStatsPayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const KPICards: React.FC<KPICardsProps> = ({
  policyStats,
  isLoading,
  isError,
  error,
}) => {
  const kpiConfigs = [
    {
      title: "Total Orders",
      value: policyStats[0]?.total_orders ?? 0,
    },
    {
      title: "Total Valid Policies",
      value: policyStats[0]?.total_valid_policies ?? 0,
    },
    {
      title: "Order Received Premium",
      value: policyStats[0]?.order_received_premium ?? 0,
    },
    {
      title: "Policy Received Premium",
      value: policyStats[0]?.policy_received_premium ?? 0,
    },
  ];

  const renderSkeletonCard = (index: number) => (
    <Card key={index} className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle>
          <Skeleton className="h-5 w-20 rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <Skeleton className="h-5 w-24 rounded-sm" />
        </div>
        <div className="h-10 w-full">
          <Skeleton className="h-full w-full rounded-sm" />
        </div>
      </CardContent>
    </Card>
  );

  const renderDataCard = (config: { title: string; value: number }) => (
    <Card key={config.title} className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800 mb-2">
          {NumberFormaterFunction(config.value)}
        </div>
        <div className="h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineMockData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={"var(--primary)"}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  if (isError) {
    return Array.from({ length: 4 }).map((_,index) => (
      <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="w-full shadow-none border-none col-span-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    ));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => renderSkeletonCard(index))
        : kpiConfigs.map((config) => renderDataCard(config))}
    </div>
  );
};

export default KPICards;
