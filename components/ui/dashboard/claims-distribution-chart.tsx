"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
const BORDER = "#e5e7eb"

const claimsByType = [
  { name: "Health", value: 35 },
  { name: "Auto", value: 25 },
  { name: "Home", value: 20 },
  { name: "Life", value: 15 },
  { name: "Travel", value: 5 },
]

export function ClaimsDistributionChart() {
  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>Claims Distribution</CardTitle>
        <CardDescription>By insurance type</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={claimsByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label
              >
                {claimsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#000" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
