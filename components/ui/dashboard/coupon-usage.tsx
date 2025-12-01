import React from "react";
import { CouponUsagePayloadType } from "@/types/dashboardTypes";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { cn } from "@/lib/utils";

const numberFormatter = (num: number | string, currency?: string): string => {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "0";

  const sign = value < 0 ? "-" : "";
  const absFormatted = Math.abs(value).toLocaleString("en-US");

  return currency
    ? `${sign}${currency} ${absFormatted}`
    : `${sign}${absFormatted}`;
};

interface CouponUsageProps {
  data: CouponUsagePayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const CouponUsage: React.FC<CouponUsageProps> = ({
  data,
  isLoading,
  isError,
  error,
}) => {
  const sortedData = data.sort((a, b) => b.total_uses - a.total_uses);

  if (isLoading) {
    return (
      <Card className="w-full shadow-none border-0">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex space-x-4 p-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-64 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-destructive">
            Error Loading Coupon Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || "An unknown error occurred."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border-0">
      <CardHeader>
        <CardTitle>Coupon Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Coupon Name</TableHead>
              <TableHead>Total Uses</TableHead>
              <TableHead>Total Discount (PKR)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((coupon, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {coupon.coupon_code}
                </TableCell>
                <TableCell>{coupon.coupon_name}</TableCell>
                <TableCell className="text-center">{numberFormatter(coupon.total_uses)}</TableCell>
                <TableCell
                  className={cn("text-center",
                    parseFloat(coupon.total_discount_amount) < 0
                      ? "text-destructive"
                      : ""
                  )}
                >
                  {numberFormatter(coupon.total_discount_amount, "PKR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No coupon data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponUsage;
