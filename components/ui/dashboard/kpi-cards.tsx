"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  tertiary: "#f59e0b",
  quaternary: "#ef4444",
  quinary: "#8b5cf6",
}

const sparklineDataPolicies = [
  { value: 20 },
  { value: 35 },
  { value: 30 },
  { value: 45 },
  { value: 40 },
  { value: 55 },
  { value: 65 },
  { value: 80 },
]

const sparklineDataClaims = [
  { value: 80 },
  { value: 65 },
  { value: 70 },
  { value: 55 },
  { value: 60 },
  { value: 45 },
  { value: 35 },
  { value: 20 },
]

const sparklineDataRevenue = [
  { value: 40 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
  { value: 55 },
  { value: 70 },
  { value: 75 },
  { value: 85 },
]

const sparklineDataSatisfaction = [
  { value: 85 },
  { value: 87 },
  { value: 86 },
  { value: 89 },
  { value: 88 },
  { value: 91 },
  { value: 92 },
  { value: 94 },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary mb-2">24,580</div>
          <p className="text-xs text-green-500 mb-3">+12.5% from last month</p>
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineDataPolicies}>
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
        </CardContent>
      </Card>

      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary mb-2">1,240</div>
          <p className="text-xs mb-3">-5.2% from last month</p>
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineDataClaims}>
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
        </CardContent>
      </Card>

      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">Premium Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary mb-2">$2.4M</div>
          <p className="text-xs mb-3">+8.3% from last month</p>
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineDataRevenue}>
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
        </CardContent>
      </Card>

      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary mb-2">94.2%</div>
          <p className="text-xs mb-3">+2.1% from last month</p>
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineDataSatisfaction}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.quinary}
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
  )
}
