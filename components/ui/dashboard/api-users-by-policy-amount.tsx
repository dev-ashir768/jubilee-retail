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

interface ApiUsersByPolicyAmountProps {
  payload: ApiUsersByPolicyAmountPayloadType[];
}

const ApiUsersByPolicyAmount: React.FC<ApiUsersByPolicyAmountProps> = ({
  payload,
}) => {
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
                  <TableHead>Api User Name</TableHead>
                  <TableHead>Api User Email</TableHead>
                  <TableHead className="text-right">
                    Total Valid Policies
                  </TableHead>
                  <TableHead className="text-right">Policy Amount</TableHead>
                  <TableHead className="text-right">Order Amount</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payload.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] whitespace-normal">
                        {item.api_user_name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.api_user_email || "N/A"}
                    </TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ApiUsersByPolicyAmount;
