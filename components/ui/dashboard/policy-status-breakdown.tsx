"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { PolicyStatusBreakdownPayloadType } from "@/types/dashboardTypes";
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

const BORDER = "#e5e7eb";

interface PolicyStatusBreakdownProps {
  payload: PolicyStatusBreakdownPayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const PolicyStatusBreakdown: React.FC<PolicyStatusBreakdownProps> = ({
  payload,
  isLoading,
  isError,
  error,
}) => {
  const chartData = payload.map((entry) => ({
    name: entry.status_group,
    value: entry.count,
  }));

  const getColor = (name: string) => {
    switch (name) {
      case "Valid":
        return "#10b981"; // green
      case "Invalid":
        return "#ef4444"; // red
      default:
        return "#8884d8"; // default
    }
  };

  const renderLabel = (props: PieLabelRenderProps) => {
    const name = props.name as string;
    const percent = props.percent as number;
    const percentage = (percent * 100).toFixed(0);
    return `${name}: ${percentage}%`;
  };

  const renderSkeleton = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40 rounded-sm" />
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
        <CardTitle>Policy Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
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
                    fill={getColor(entry.name)}
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
                  `${value.toLocaleString()} Policies`,
                  "Count",
                ]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value: string) => `${value} Policies`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyStatusBreakdown;
