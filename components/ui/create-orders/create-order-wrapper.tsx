"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import SubNav from "../foundations/sub-nav";
import ExcelUpload from "./excel-upload";
import { createBulkOrderState } from "@/hooks/createBulkOrderState";
import CreateOrderDatatable from "./create-order-datatable";
import { ColumnDef } from "@tanstack/react-table";
import {
  BulkOrderResponseType,
  BulkPolicyDetailType,
  CreateBulkOrder,
  RiderTypes,
  BulkOrderSuccessResult,
  BulkOrderFailedResult,
} from "@/types/createBulkOrder";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { Button } from "../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import { useMutation } from "@tanstack/react-query";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { Badge } from "../shadcn/badge";
import { toast } from "sonner";
import Link from "next/link";

const CreateOrderWrapper = () => {
  const { jsonResult, setJsonResult } = createBulkOrderState();
  const [toggle, setToggle] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPolicyDetail, setSelectedPolicyDetail] = useState<
    BulkPolicyDetailType[] | null
  >(null);
  const [isRiderDialogOpen, setIsRiderDialogOpen] = useState(false);
  const [selectedRiders, setSelectedRiders] = useState<RiderTypes[] | null>(
    null
  );
  const [successData, setSuccessData] = useState<BulkOrderSuccessResult[]>([]);
  const [failedData, setFailedData] = useState<BulkOrderFailedResult[]>([]);

  useEffect(() => {
    if (jsonResult && jsonResult?.length > 0) {
      setToggle(true);
      setShowResults(false); // Reset results when new upload
    }
  }, [jsonResult]);

  const handleToggle = (toView: boolean) => {
    setToggle(toView);
    setJsonResult(null);
    setShowResults(false);
    setSuccessData([]);
    setFailedData([]);
  };

  const handleOpenPolicyDetail = (policyDetail: BulkPolicyDetailType[]) => {
    setSelectedPolicyDetail(policyDetail);
    setIsDialogOpen(true);
  };

  const handleOpenRiderDetail = (riders: RiderTypes[]) => {
    setSelectedRiders(riders);
    setIsRiderDialogOpen(true);
  };

  const handleTemplateDownload = () => {
    const a = document.createElement("a");
    a.href = "/templates/template.xlsx";
    a.download = "template";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // HANDLE MUTATION
  const createBulkOrderMutation = useMutation<
    BulkOrderResponseType,
    AxiosError<BulkOrderResponseType>,
    CreateBulkOrder[]
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/orders/bulk",
        isServer: true,
        data: record,
      });
    },
    onSuccess: (data) => {
      if (data.status === 1 && data.payload && data.payload.length > 0) {
        const payloadItem = data.payload[0];
        setSuccessData(payloadItem.successResults || []);
        setFailedData(payloadItem.failedResults || []);
        setShowResults(true);
        toast.success(data.message);
      }
    },
    onError: (error) => {
      console.error("Bulk order creation failed:", error);
      toast.error(error.response?.data.message);
    },
  });

  const handlePush = useCallback(() => {
    if (!jsonResult || jsonResult.length === 0) return;
    createBulkOrderMutation.mutate(jsonResult);
  }, [jsonResult, createBulkOrderMutation]);

  // ======== REVIEW COLUMNS ========
  const reviewColumns: ColumnDef<CreateBulkOrder>[] = [
    {
      accessorKey: "api_user_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Partner Name" />
      ),
      cell: ({ row }) => <div>{row.original.api_user_name || "N/A"}</div>,
    },
    {
      accessorKey: "payment_mode_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Payment Mode" />
      ),
      cell: ({ row }) => (
        <div>{row.original.payment_mode_code.toUpperCase() || "N/A"}</div>
      ),
    },
    {
      accessorKey: "child_sku",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Plan" />
      ),
      cell: ({ row }) => <div>{row.original.child_sku || "N/A"}</div>,
    },
    {
      accessorKey: "order_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Order No" />
      ),
      cell: ({ row }) => <div>{row.original.order_code || "N/A"}</div>,
    },
    {
      accessorKey: "customer_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Client Name" />
      ),
      cell: ({ row }) => <div>{row.original.customer_name || "N/A"}</div>,
    },
    {
      accessorKey: "customer_cnic",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Client CNIC" />
      ),
      cell: ({ row }) => <div>{row.original.customer_cnic || "N/A"}</div>,
    },
    {
      accessorKey: "customer_dob",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Client DOB" />
      ),
      cell: ({ row }) => <div>{row.original.customer_dob || "N/A"}</div>,
    },
    {
      accessorKey: "customer_email",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Client Email" />
      ),
      cell: ({ row }) => <div>{row.original.customer_email || "N/A"}</div>,
    },
    {
      accessorKey: "cnic_issue_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="CNIC Issue Date" />
      ),
      cell: ({ row }) => <div>{row.original.cnic_issue_date || "N/A"}</div>,
    },
    {
      accessorKey: "customer_contact",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Client Contact" />
      ),
      cell: ({ row }) => <div>{row.original.customer_contact || "N/A"}</div>,
    },
    {
      accessorKey: "customer_address",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => <div>{row.original.customer_address || "N/A"}</div>,
    },
    {
      accessorKey: "customer_gender",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => (
        <div>{row.original.customer_gender.toUpperCase() || "N/A"}</div>
      ),
    },
    {
      accessorKey: "customer_occupation",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Occupation" />
      ),
      cell: ({ row }) => <div>{row.original.customer_occupation || "N/A"}</div>,
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Start Date" />
      ),
      cell: ({ row }) => <div>{row.original.start_date || "N/A"}</div>,
    },
    {
      accessorKey: "expiry_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Expiry Date" />
      ),
      cell: ({ row }) => <div>{row.original.expiry_date || "N/A"}</div>,
    },
    {
      accessorKey: "issue_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Issue Date" />
      ),
      cell: ({ row }) => <div>{row.original.issue_date || "N/A"}</div>,
    },
    {
      accessorKey: "received_premium",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Premium" />
      ),
      cell: ({ row }) => <div>{row.original.received_premium || "N/A"}</div>,
    },
    {
      id: "policy_detail",
      header: "Policy Detail",
      cell: ({ row }: { row: { original: CreateBulkOrder } }) => {
        const policyDetail = row.original.policy_detail;
        return (
          <div className="text-xs">
            {policyDetail.length > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenPolicyDetail(policyDetail)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            ) : (
              "No beneficiaries"
            )}
          </div>
        );
      },
    },
    {
      id: "rider",
      header: "Riders",
      cell: ({ row }: { row: { original: CreateBulkOrder } }) => {
        const riders = row.original.rider;
        return (
          <div className="text-xs">
            {riders && riders.length > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenRiderDetail(riders)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            ) : (
              "No riders"
            )}
          </div>
        );
      },
    },
  ];

  // ======== SUCCESS COLUMNS ========
  const successColumns: ColumnDef<BulkOrderSuccessResult>[] = [
    {
      accessorKey: "order_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Order Code" />
      ),
      cell: ({ row }) => <div>{row.original.order_code || "N/A"}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.status as "success"}>
          {row.original.status || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => <div>{row.original.message || "N/A"}</div>,
    },
  ];

  // ======== FAILED COLUMNS ========
  const failedColumns: ColumnDef<BulkOrderFailedResult>[] = [
    {
      accessorKey: "order_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Order Code" />
      ),
      cell: ({ row }) => <div>{row.original.order_code || "N/A"}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.status as "failed"}>
          {row.original.status || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => <div>{row.original.message || "N/A"}</div>,
    },
  ];

  return (
    <>
      {!toggle ? (
        <>
          <div className="flex md:flex-row flex-col justify-between items-center">
            <SubNav title="Create Order" />
            <div className="flex gap-4 flex-wrap">
              <Button
                size="lg"
                className="min-w-[150px]"
                type="button"
                variant="secondary"
                asChild
              >
                <Link href="/product-plans" target="_blank">
                  Product Plan
                </Link>
              </Button>
              <Button
                size="lg"
                className="min-w-[150px]"
                type="button"
                onClick={handleTemplateDownload}
              >
                Template
              </Button>
            </div>
          </div>
          <Card className="w-full h-full shadow-none border-none">
            <CardHeader className="border-b">
              <CardTitle>Create your all orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ExcelUpload />
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex md:flex-row flex-col justify-between items-center">
            <h2 className="text-lg font-semibold">Order Review</h2>
            <div className="space-x-2">
              {!showResults ? (
                <>
                  <Button
                    size="lg"
                    className="min-w-[150px]"
                    onClick={handlePush}
                    disabled={createBulkOrderMutation.isPending}
                  >
                    {createBulkOrderMutation.isPending
                      ? createBulkOrderMutation.isSuccess
                        ? "Pushed"
                        : "Pushing..."
                      : "Push Order"}
                  </Button>
                </>
              ) : (
                <>
                  <Badge
                    variant="success"
                    className="min-w-[150px] h-[40px] cursor-auto"
                  >
                    Success: {successData.length}
                  </Badge>
                  <Badge
                    variant="danger"
                    className="min-w-[150px] h-[40px] cursor-auto"
                  >
                    Failed: {failedData.length}
                  </Badge>
                </>
              )}
              <Button
                size="lg"
                variant="secondary"
                className="min-w-[150px]"
                onClick={() => handleToggle(false)}
              >
                Back to Upload
              </Button>
            </div>
          </div>
          {!showResults ? (
            <CreateOrderDatatable
              columns={reviewColumns}
              payload={jsonResult || []}
            />
          ) : (
            <>
              <Tabs defaultValue="success" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="view">Review</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                  <TabsTrigger value="error">Error</TabsTrigger>
                </TabsList>
                <TabsContent value="view" className="mt-4">
                  <CreateOrderDatatable
                    columns={reviewColumns}
                    payload={jsonResult || []}
                  />
                </TabsContent>
                <TabsContent value="success" className="mt-4">
                  {successData.length > 0 ? (
                    <CreateOrderDatatable
                      columns={successColumns}
                      payload={successData}
                    />
                  ) : (
                    <>
                      <Card className="w-full shadow-none border-none">
                        <CardHeader className="border-b gap-0">
                          <CardTitle>List of all successful orders.</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                          No successful orders.
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="error" className="mt-4">
                  {failedData.length > 0 ? (
                    <CreateOrderDatatable
                      columns={failedColumns}
                      payload={failedData}
                    />
                  ) : (
                    <>
                      <Card className="w-full shadow-none border-none">
                        <CardHeader className="border-b gap-0">
                          <CardTitle>List of all failed orders.</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                          {" "}
                          No failed orders.
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      )}

      {/* Beneficiary Details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[760px] gap-6">
          <DialogHeader>
            <DialogTitle>Beneficiary Details</DialogTitle>
            <DialogDescription>
              Showing all beneficiaries for the selected policy.
            </DialogDescription>
          </DialogHeader>
          {/* Content for the dialog */}
          <div className="max-h-[60vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPolicyDetail && selectedPolicyDetail.length > 0 ? (
              selectedPolicyDetail.map(
                (beneficiary: BulkPolicyDetailType, index: number) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
                  >
                    <h4 className="font-semibold text-base mb-3 text-primary">
                      Beneficiary {index + 1}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Name:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {beneficiary.name || "N/A"}
                      </span>

                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Relationship:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {beneficiary.relation || "N/A"}
                      </span>

                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        CNIC:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {beneficiary.cnic || "N/A"}
                      </span>

                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        CNIC Issue Date:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {beneficiary.cnic_issue_date || "N/A"}
                      </span>

                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        DOB:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {beneficiary.dob || "N/A"}
                      </span>

                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Gender:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {beneficiary.gender?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No beneficiary details found for this policy.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rider Details Dialog */}
      <Dialog open={isRiderDialogOpen} onOpenChange={setIsRiderDialogOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[600px] gap-6">
          <DialogHeader>
            <DialogTitle>Rider Details</DialogTitle>
            <DialogDescription>
              Showing all riders for the selected policy.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {selectedRiders && selectedRiders.length > 0 ? (
              <ul className="space-y-3">
                {selectedRiders.map((rider: RiderTypes, index: number) => (
                  <li
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-base text-primary">
                        {rider.name || "N/A"}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">
                        Sum Insured
                      </span>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {rider.sum_insured || "0"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No rider details found for this policy.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateOrderWrapper;
