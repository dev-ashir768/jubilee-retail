import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Label } from "../shadcn/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/table";
import { Badge } from "../shadcn/badge";
import { SingleOrderPayloadTypes } from "@/types/singleOrderType";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderSingleData: SingleOrderPayloadTypes | null;
}

const SingleOrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onOpenChange,
  orderSingleData,
}) => {
  if (!orderSingleData) return null;

  // Helper to calculate age
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[1000px] max-h-[90vh] h-full overflow-y-scroll">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  Order Details
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Order #{orderSingleData.order_code}
                </p>
              </div>
              <Badge
                variant={
                  orderSingleData.status.toLowerCase() as
                    | "accepted"
                    | "cancelled"
                    | "pendingcod"
                    | "rejected"
                    | "unverified"
                    | "verified"
                    | "pending"
                    | "cancelled"
                    | "hisposted"
                    | "igisposted"
                    | "pendingigis"
                    | "pendingcod"
                    | "pendingcbo"
                }
              >
                {orderSingleData.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="w-full shadow-none border-none bg-gray-50">
              <CardHeader className="border-b gap-0">
                <CardTitle className="text-lg">Order Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InfoField
                    label="Order Number"
                    value={orderSingleData.order_code}
                  />
                  <InfoField
                    label="Premium"
                    value={`PKR ${orderSingleData.payment}`}
                    highlight
                  />
                  <InfoField
                    label="Created"
                    value={new Date(
                      orderSingleData.create_date
                    ).toLocaleDateString()}
                  />
                  <InfoField
                    label="Transaction ID"
                    value={orderSingleData.cc_transaction_id || "N/A"}
                  />
                  <InfoField
                    label="Approval Code"
                    value={orderSingleData.cc_approval_code || "N/A"}
                  />
                  <InfoField
                    label="Referred By"
                    value={orderSingleData.referred_by}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="w-full shadow-none border-none bg-gray-50">
              <CardHeader className="border-b gap-0">
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoField
                    label="Agent"
                    value={orderSingleData.agent_name || "N/A"}
                  />
                  <InfoField
                    label="Branch"
                    value={orderSingleData.branch_name}
                  />
                  <InfoField
                    label="Client"
                    value={
                      orderSingleData.client_id
                        ? `Client ${orderSingleData.client_id}`
                        : "N/A"
                    }
                  />
                  <InfoField
                    label="Development Office"
                    value={
                      orderSingleData.development_office_id
                        ? `DO ${orderSingleData.development_office_id}`
                        : "N/A"
                    }
                  />
                  <InfoField
                    label="Payment Method"
                    value={orderSingleData.payemntMethod?.name || "N/A"}
                  />
                  <InfoField
                    label="Shipping Method"
                    value={orderSingleData.shipping_method}
                  />
                  <div className="md:col-span-3">
                    <InfoField
                      label="API Partner Name"
                      value={
                        orderSingleData.api_user_id
                          ? `API User ${orderSingleData.api_user_id}`
                          : "N/A"
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full shadow-none border-none bg-gray-50">
              <CardHeader className="border-b gap-0">
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoField
                    label="Name"
                    value={orderSingleData.customer_name}
                  />
                  <InfoField
                    label="CNIC"
                    value={orderSingleData.customer_cnic}
                  />
                  <InfoField
                    label="Phone"
                    value={orderSingleData.customer_contact}
                  />
                  <InfoField
                    label="Email"
                    value={orderSingleData.customer_email}
                  />
                  <InfoField
                    label="Age"
                    value={
                      orderSingleData.customer_dob
                        ? calculateAge(orderSingleData.customer_dob)
                        : "N/A"
                    }
                  />
                  <InfoField
                    label="Gender"
                    value={
                      orderSingleData.Policy?.[0]?.policyDetails?.[0]?.gender ||
                      "N/A"
                    }
                  />
                  <div className="md:col-span-2">
                    <InfoField
                      label="Address"
                      value={orderSingleData.customer_address}
                    />
                  </div>
                  <InfoField
                    label="CNIC Issue Date"
                    value={
                      orderSingleData.Policy?.[0]?.policyDetails?.[0]
                        ?.cnic_issue_date || "N/A"
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {orderSingleData.Policy && orderSingleData.Policy.length > 0 && (
              <Card className="w-full shadow-none border-none bg-gray-50">
                <CardHeader className="border-b gap-0">
                  <CardTitle className="text-lg">
                    Included Plans & Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-white">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-semibold">
                            Policy Number
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white">
                        {orderSingleData.Policy.map((policy) => (
                          <TableRow
                            key={policy.id}
                            className="hover:bg-muted/30"
                          >
                            <TableCell className="font-medium">
                              {policy.policy_code}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  policy.status.toLocaleLowerCase() as
                                    | "accepted"
                                    | "cancelled"
                                }
                              >
                                {policy.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {orderSingleData.Policy &&
              orderSingleData.Policy[0]?.policyDetails &&
              orderSingleData.Policy[0].policyDetails.length > 0 && (
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle className="text-lg">Policy Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-white">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold">
                              Name
                            </TableHead>
                            <TableHead className="font-semibold">DOB</TableHead>
                            <TableHead className="font-semibold">
                              CNIC
                            </TableHead>
                            <TableHead className="font-semibold">
                              Relation
                            </TableHead>
                            <TableHead className="font-semibold">
                              Type
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                          {orderSingleData.Policy[0].policyDetails.map(
                            (detail) => (
                              <TableRow
                                key={detail.id}
                                className="hover:bg-muted/30"
                              >
                                <TableCell className="font-medium">
                                  {detail.name}
                                </TableCell>
                                <TableCell>{detail.dob || "N/A"}</TableCell>
                                <TableCell>{detail.cnic}</TableCell>
                                <TableCell>{detail.relation}</TableCell>
                                <TableCell>{detail.type}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

            {orderSingleData.Policy &&
              orderSingleData.Policy[0]?.PolicyTravel &&
              orderSingleData.Policy[0].PolicyTravel.length > 0 && (
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle className="text-lg">
                      Travel Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <InfoField
                        label="Destination"
                        value={
                          orderSingleData.Policy[0].PolicyTravel[0].destination
                        }
                      />
                      <InfoField
                        label="Travel Purpose"
                        value={
                          orderSingleData.Policy[0].PolicyTravel[0]
                            .travel_purpose
                        }
                      />
                      <InfoField
                        label="Travel From"
                        value={
                          orderSingleData.Policy[0].PolicyTravel[0].travel_from
                        }
                      />
                      <InfoField
                        label="No. of Days"
                        value={
                          orderSingleData.Policy[0].PolicyTravel[0].no_of_days
                        }
                      />
                      <InfoField
                        label="Start Date"
                        value={new Date(
                          orderSingleData.Policy[0].PolicyTravel[0].travel_start_date
                        ).toLocaleDateString()}
                      />
                      <InfoField
                        label="End Date"
                        value={new Date(
                          orderSingleData.Policy[0].PolicyTravel[0].travel_end_date
                        ).toLocaleDateString()}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface InfoFieldProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, highlight }) => (
  <div
    className={
      highlight ? "p-3 rounded-lg bg-primary/5 border border-primary/10" : ""
    }
  >
    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {label}
    </Label>
    <p
      className={`mt-2 font-medium ${
        highlight ? "text-primary text-lg" : "text-foreground"
      }`}
    >
      {value}
    </p>
  </div>
);

export default SingleOrderDetailDialog;
