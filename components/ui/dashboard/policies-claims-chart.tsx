"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  border: "#e5e7eb",
  text: "#6b7280",
}

const policyData = [
  { month: "Jan", policies: 2400, claims: 240, premium: 2210 },
  { month: "Feb", policies: 1398, claims: 221, premium: 2290 },
  { month: "Mar", policies: 9800, claims: 229, premium: 2000 },
  { month: "Apr", policies: 3908, claims: 200, premium: 2181 },
  { month: "May", policies: 4800, claims: 220, premium: 2500 },
  { month: "Jun", policies: 3800, claims: 250, premium: 2100 },
]

export function PoliciesClaimsChart() {
  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle >Policies & Claims Trend</CardTitle>
        <CardDescription >Monthly performance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={policyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} opacity={0.2} />
              <XAxis dataKey="month" stroke={COLORS.text} />
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
              <Line
                type="monotone"
                dataKey="policies"
                stroke={COLORS.primary}
                strokeWidth={3}
                dot={{ fill: COLORS.primary, r: 5 }}
                activeDot={{ r: 7 }}
                name="Policies"
              />
              <Line
                type="monotone"
                dataKey="claims"
                stroke={COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: COLORS.secondary, r: 5 }}
                activeDot={{ r: 7 }}
                name="Claims"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
