"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { PolicyStatsPayloadType } from "@/types/dashboardTypes";
import { LineChart, Line, ResponsiveContainer } from "recharts";

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
}

const KPICards: React.FC<KPICardsProps> = ({ policyStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {policyStats[0].total_orders}
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

      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">
            Total Valid Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {policyStats[0].total_valid_policies}
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

      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">
            Order Received Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {policyStats[0].order_received_premium}
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

      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">
            Policy Received Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {policyStats[0].policy_received_premium}
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
    </div>
  );
};

export default KPICards;
