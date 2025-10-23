"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import SubNav from "../foundations/sub-nav";
import ExcelUpload from "./excel-upload";
import { createBulkOrderState } from "@/hooks/createBulkOrderState";
import CreateOrderDatatable from "./create-order-datatable";
import { ColumnDef } from "@tanstack/react-table";
import { BulkPolicyDetailType, CreateBulkOrder } from "@/types/createBulkOrder";
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

const CreateOrderWrapper = () => {
  const { jsonResult, setJsonResult } = createBulkOrderState();
  const [toggle, setToggle] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPolicyDetail, setSelectedPolicyDetail] = useState<
    BulkPolicyDetailType[] | null
  >(null);

  useEffect(() => {
    if (jsonResult && jsonResult?.length > 0) {
      setToggle(true);
    }
  }, [jsonResult, toggle, setToggle]);

  const handleToggle = (toView: boolean) => {
    setToggle(toView);
    setJsonResult(null);
  };

  const handleOpenPolicyDetail = (policyDetail: BulkPolicyDetailType[]) => {
    setSelectedPolicyDetail(policyDetail);
    setIsDialogOpen(true);
  };

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<CreateBulkOrder>[] = [
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
      cell: ({ row }) => <div>{row.original.payment_mode_code || "N/A"}</div>,
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
      cell: ({ row }) => <div>{row.original.customer_gender || "N/A"}</div>,
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
      cell: ({ row }) => (
        <div className="text-xs">
          {row.original.rider.length > 0 ? (
            <div>
              <span className="font-medium">
                Riders ({row.original.rider.length}):
              </span>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                {row.original.rider.slice(0, 3).map((r, idx) => (
                  <li key={idx}>
                    {r.name} ({r.sum_insured})
                  </li>
                ))}
                {row.original.rider.length > 3 && (
                  <li>... and {row.original.rider.length - 3} more</li>
                )}
              </ul>
            </div>
          ) : (
            "No riders"
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {!toggle ? (
        <>
          <SubNav title="Create Order" />
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
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Order Review</h2>
            <div className="space-x-2">
              <Button size="lg" onClick={() => handleToggle(false)}>
                Back to Upload
              </Button>
            </div>
          </div>
          <CreateOrderDatatable columns={columns} payload={jsonResult || []} />
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[660px] gap-6">
          <DialogHeader>
            <DialogTitle>Beneficiary Details</DialogTitle>
            <DialogDescription>
              Showing all beneficiaries for the selected policy.
            </DialogDescription>
          </DialogHeader>
          {/* Content for the dialog */}
          <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-4">
            {selectedPolicyDetail && selectedPolicyDetail.length > 0 ? (
              selectedPolicyDetail.map((beneficiary: BulkPolicyDetailType, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
                >
                  <h4 className="font-semibold text-base mb-3 text-blue-600 dark:text-blue-400">
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
                      {beneficiary.gender || "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No beneficiary details found for this policy.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateOrderWrapper;
