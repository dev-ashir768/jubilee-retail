import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/table";
import { PaymentModePayloadType } from "@/types/dashboardTypes";
import { Skeleton } from "../shadcn/skeleton";
import { formatNumberCell } from "@/utils/numberFormaterFunction";

interface PaymentModeProps {
  payload: PaymentModePayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const PaymentMode: React.FC<PaymentModeProps> = ({
  payload,
  isLoading,
  isError,
  error,
}) => {
  const renderSkeleton = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32 rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 sticky top-0">
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-28" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    <>
      <Card className="w-full shadow-none border-none">
        <CardHeader>
          <CardTitle>Payment Modes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 sticky top-0">
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                  <TableHead className="text-right">
                    Total Received Amount
                  </TableHead>
                  <TableHead className="text-right">
                    Valid Policies Count
                  </TableHead>
                  <TableHead className="text-right">
                    Total Discount Given
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payload.length > 0 ? (
                  payload.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] whitespace-normal">
                          {item.payment_mode?.replace("_", " ") || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumberCell(item.total_orders) || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumberCell(+item.total_received_amount) || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumberCell(item.valid_policies_count) || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumberCell(+item.total_discount_given) || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-[285px] text-center text-muted-foreground"
                    >
                      No data to display.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PaymentMode;
