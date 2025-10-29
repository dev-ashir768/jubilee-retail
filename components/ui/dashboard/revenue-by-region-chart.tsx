"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = {
  primary: "#3b82f6",
  border: "#e5e7eb",
  text: "#6b7280",
}

const regionData = [
  { region: "North", sales: 4000 },
  { region: "South", sales: 3000 },
  { region: "East", sales: 2000 },
  { region: "West", sales: 2780 },
  { region: "Central", sales: 1890 },
]

export function RevenueByRegionChart() {
  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>Revenue by Region</CardTitle>
        <CardDescription >Quarterly performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} opacity={0.2} />
              <XAxis dataKey="region" stroke={COLORS.text} />
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
              <Bar dataKey="sales" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
