import { Top5BranchesPayloadType } from "@/types/dashboardTypes";
import React from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Skeleton } from "../shadcn/skeleton";
import { formatNumberCell } from "@/utils/numberFormaterFunction";

interface Top5BranchesProps {
  payload: Top5BranchesPayloadType[];
  isError: boolean;
  error: string;
  isLoading: boolean;
}

const Top5Branches: React.FC<Top5BranchesProps> = ({
  payload,
  isLoading,
  isError,
  error,
}) => {
  const generateSparklineData = (finalValue: number) => {
    const points = 8;
    const data = [];
    const baseValue = finalValue / points; // Simple scaling for trend
    for (let i = 0; i < points; i++) {
      // Create an increasing trend towards the final value
      const value = baseValue * (i + 1) + Math.random() * baseValue * 0.5 - baseValue * 0.25;
      data.push({ value: Math.max(0, value) });
    }
    // Ensure last point is close to final value
    data[points - 1].value = finalValue;
    return data;
  };

  const renderSkeletonCard = () => (
    <Card className="w-full shadow-none border-none">
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
  
  const renderDataCard = (item: Top5BranchesPayloadType) => {
    const policyAmount = Number(item.policy_amount) || 0;
    const sparklineData = generateSparklineData(policyAmount);
    return (
      <Card className="w-full shadow-none border-none h-full">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">
            {item.branch_name || "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {formatNumberCell(policyAmount)}
          </div>
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
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
  };

  if (isError) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="w-full shadow-none border-none col-span-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>{renderSkeletonCard()}</div>
            ))
          : payload.map((item, index) => (
              <div key={index}>{renderDataCard(item)}</div>
            ))}
      </div>
    </>
  );
};

export default Top5Branches;