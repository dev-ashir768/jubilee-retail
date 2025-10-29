"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  tertiary: "#f59e0b",
}

const sparklineData = [
  { value: 20 },
  { value: 35 },
  { value: 30 },
  { value: 45 },
  { value: 40 },
  { value: 55 },
  { value: 65 },
  { value: 80 },
]

export function PerformanceSparklineChart() {
  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle >Performance Sparkline</CardTitle>
        <CardDescription >Last 9 periods trend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-white">Policy Growth</span>
              <span className="text-sm font-bold text-green-500">+45%</span>
            </div>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-white">Claims Reduction</span>
              <span className="text-sm font-bold text-red-500">-12%</span>
            </div>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData.map((d) => ({ value: 100 - d.value }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.secondary}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-white">Customer Retention</span>
              <span className="text-sm font-bold text-blue-500">+8%</span>
            </div>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.tertiary}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
