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

const COLORS = ["#10b981", "#ef4444"];
const BORDER = "#e5e7eb";

interface PolicyStatusBreakdownProps {
  payload: PolicyStatusBreakdownPayloadType[];
}

const PolicyStatusBreakdown: React.FC<PolicyStatusBreakdownProps> = ({
  payload,
}) => {
  const chartData = payload.map((entry) => ({
    name: entry.status_group,
    value: entry.count,
  }));

  const renderLabel = (props: PieLabelRenderProps) => {
    const name = props.name as string;
    const percent = props.percent as number;
    const percentage = (percent * 100).toFixed(0);
    return `${name}: ${percentage}%`;
  };

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
                formatter={(value: number) => [`${value.toLocaleString()} Policies`, "Count"]}
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