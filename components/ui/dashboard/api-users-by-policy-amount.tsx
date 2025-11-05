import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { ApiUsersByPolicyAmountPayloadType } from "@/types/dashboardTypes";
import { Skeleton } from "../shadcn/skeleton";

interface ApiUsersByPolicyAmountProps {
  payload: ApiUsersByPolicyAmountPayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const ApiUsersByPolicyAmount: React.FC<ApiUsersByPolicyAmountProps> = ({
  payload,
  isLoading,
  isError,
  error,
}) => {
  
  const renderSkeleton = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle className="text-base sm:text-lg">
          <Skeleton className="h-6 w-48 rounded-sm" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 sticky top-0">
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
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
      <CardHeader className="gap-0">
        <CardTitle className="text-base sm:text-lg">Error</CardTitle>
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
        <CardHeader className="gap-0">
          <CardTitle className="text-base sm:text-lg">
            Top 5 Api Users by Policy Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 sticky top-0">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">
                    Total Valid Policies
                  </TableHead>
                  <TableHead className="text-right">Policy Amount</TableHead>
                  <TableHead className="text-right">Order Amount</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payload.length > 0 ? (
                  payload.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] whitespace-normal">
                          {item.api_user_name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>{item.api_user_email || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        {item.total_valid_policies || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.policy_amount || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.order_amount || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.total_orders || "N/A"}
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

export default ApiUsersByPolicyAmount;
