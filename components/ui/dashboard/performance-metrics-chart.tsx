"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = {
  current: "#3b82f6",
  target: "#10b981",
  border: "#e5e7eb",
  text: "#6b7280",
}

const performanceData = [
  { category: "Sales", current: 120, target: 150 },
  { category: "Service", current: 98, target: 150 },
  { category: "Retention", current: 86, target: 150 },
  { category: "Claims", current: 99, target: 150 },
  { category: "Growth", current: 85, target: 150 },
  { category: "Efficiency", current: 65, target: 150 },
]

export function PerformanceMetricsChart() {
  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Current vs target performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} opacity={0.2} />
              <XAxis dataKey="category" stroke={COLORS.text} />
              <YAxis stroke={COLORS.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#000" }}
                cursor={{ fill: "transparent" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="current" fill={COLORS.current} radius={[8, 8, 0, 0]} name="Current" />
              <Bar dataKey="target" fill={COLORS.target} radius={[8, 8, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
