import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { ProductShareOfPolicyAmountByAmountPayloadType } from "@/types/dashboardTypes";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieLabelRenderProps,
} from "recharts";
import { Skeleton } from "../shadcn/skeleton";
import { NumberFormaterFunction } from "@/utils/numberFormaterFunction";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f3f4f6",
];
const BORDER = "#e5e7eb";

interface ProductShareOfPolicyAmountByAmountProps {
  payload: ProductShareOfPolicyAmountByAmountPayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const ProductShareOfPolicyAmountByAmount: React.FC<
  ProductShareOfPolicyAmountByAmountProps
> = ({ payload, isLoading, isError, error }) => {
  const chartData = payload.map((entry) => ({
    name: entry.product_name.replace("-", " "),
    value: Number(entry.policy_amount ?? "0"),
  }));


  const renderLabel = (props: PieLabelRenderProps) => {
    const percent = props.percent as number;
    const percentage = (percent * 100).toFixed(0);
    return `${percentage}%`;
  };

  const renderSkeleton = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle className="text-base sm:text-lg">
          <Skeleton className="h-6 w-56 rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="h-80 w-full flex items-center justify-center">
          <div className="relative h-64 w-64">
            <Skeleton className="absolute inset-0 rounded-full h-full w-full" />
            <div className="absolute left-8 top-8 h-48 w-48 rounded-full bg-background" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderError = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle className="text-base sm:text-lg">Error</CardTitle>
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

  if (chartData.length === 0) {
    return (
      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-base sm:text-lg">
            Product Share of Policy Amount by Amount
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground">No data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle className="text-base sm:text-lg">
          Product Share of Policy Amount by Amount
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center relative">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={renderLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#000" }}
                formatter={(value: number) => [
                  `${NumberFormaterFunction(value)} Amount`,
                  "Policy Amount",
                ]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value: string) =>
                  `${value}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductShareOfPolicyAmountByAmount;