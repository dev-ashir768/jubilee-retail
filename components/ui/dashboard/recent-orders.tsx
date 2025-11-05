import { RecentOrdersPayloadType } from "@/types/dashboardTypes";
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
import { Badge } from "../shadcn/badge";
import { Skeleton } from "../shadcn/skeleton";

interface RecentOrdersProps {
  payload: RecentOrdersPayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
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
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-28" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
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
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
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
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 sticky top-0">
                  <TableHead>Order Code</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Customer Contact</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Received Premium</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payload.length > 0 ? (
                  payload.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.order_code || "N/A"}
                      </TableCell>
                      <TableCell>
                        {item.customer_name?.replace("-", " ") || "N/A"}
                      </TableCell>
                      <TableCell>{item.customer_contact || "N/A"}</TableCell>
                      <TableCell>
                        {item.product_name.replace(/-/g, " ") || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status
                              .toLocaleLowerCase()
                              .replace("_", "") as "pendingcbo"
                          }
                        >
                          {item.status || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.received_premium || "N/A"}
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

export default RecentOrders;
