"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  border: "#e5e7eb",
  text: "#6b7280",
}

const revenueData = [
  { name: "Week 1", revenue: 3000, target: 3500 },
  { name: "Week 2", revenue: 3400, target: 3700 },
  { name: "Week 3", revenue: 3800, target: 4000 },
  { name: "Week 4", revenue: 4200, target: 4500 },
  { name: "Week 5", revenue: 4600, target: 5000 },
  { name: "Week 6", revenue: 5000, target: 5500 },
  { name: "Week 7", revenue: 5400, target: 5800 },
  { name: "Week 8", revenue: 5800, target: 6200 },
]

export function RevenueTrendChart() {
  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Weekly performance vs target</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} opacity={0.2} />
              <XAxis dataKey="name" stroke={COLORS.text} />
              <YAxis stroke={COLORS.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#000" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke={COLORS.secondary}
                fill={COLORS.secondary}
                fillOpacity={0.2}
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
