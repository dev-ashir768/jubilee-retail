"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../shadcn/button";
import { Badge } from "../shadcn/badge";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import SubNav from "../foundations/sub-nav";
import { fetchOrdersListing } from "@/helperFunctions/ordersFunctions";
import { CboPayloadType, CboResponseType } from "@/types/cboTypes";
import CboDatatable from "./cbo-datatable";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import { ApiUsersResponseType } from "@/types/usersTypes";
import { fetchAllApiUserList } from "@/helperFunctions/userFunction";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { BranchResponseType } from "@/types/branchTypes";
import { fetchAllBranchList } from "@/helperFunctions/branchFunction";
import { PaymentModesResponseType } from "@/types/paymentModesTypes";
import { fetchPaymentModesList } from "@/helperFunctions/paymentModesFunction";
import OrdersFilters from "../filters/orders-filters";
import { cboListFilterState } from "@/hooks/cboListFilterState";
import {
  SingleOrderPayloadTypes,
  SingleOrderResponseTypes,
} from "@/types/singleOrderType";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import SingleOrderDetailDialog from "../modal-dialog/single-order-detail-dialog";
import GenerateHis from "./generate-his";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import ChangeCBOPolicyStatus from "./change-cbo-policy-status";
import { fetchAllProductsList } from "@/helperFunctions/productsFunction";
import { formatNumberCell } from "@/utils/numberFormaterFunction";

const CboList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/cbo";
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportZipOpen, setIsExportZipOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isPolicyId, setIsPolicyId] = useState<number>();
  const [orderSingleData, setSingleOrderData] =
    useState<SingleOrderPayloadTypes | null>(null);
  const { filterValue } = cboListFilterState();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: apiUserListResponse,
    isLoading: apiUserListLoading,
    isError: apiUserListIsError,
    error: apiUserListError,
  } = useQuery<ApiUsersResponseType | null>({
    queryKey: ["all-api-user-list"],
    queryFn: fetchAllApiUserList,
  });

  const {
    data: productListResponse,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["all-products-list"],
    queryFn: fetchAllProductsList,
  });

  const {
    data: branchListResponse,
    isLoading: branchListLoading,
    isError: branchListIsError,
    error: branchListError,
  } = useQuery<BranchResponseType | null>({
    queryKey: ["all-branch-list"],
    queryFn: fetchAllBranchList,
  });

  const {
    data: paymentModesListresponse,
    isLoading: paymentModesListLoading,
    isError: paymentModesListIsError,
    error: paymentModesListError,
  } = useQuery<PaymentModesResponseType | null>({
    queryKey: ["payment-modes-list"],
    queryFn: fetchPaymentModesList,
  });

  const {
    data: cobListResponse,
    isLoading: cboListIsLoading,
    isError: cboListIsError,
    error: cboListError,
    isRefetching: cboListIsRefetching,
    refetch: cboListRefetch,
  } = useQuery<CboResponseType | null>({
    queryKey: [
      "cbo-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
      ...(filterValue?.month ? [filterValue.month] : []),
      ...(filterValue?.policy_status ? [filterValue.policy_status] : []),
      ...(filterValue?.contact ? [filterValue.contact] : []),
      ...(filterValue?.api_user_id ? [filterValue.api_user_id] : []),
      ...(filterValue?.branch_id ? [filterValue.branch_id] : []),
      ...(filterValue?.payment_mode_id ? [filterValue.payment_mode_id] : []),
      ...(filterValue?.product_id ? [filterValue.product_id] : []),
      ...(filterValue?.cnic ? [filterValue.cnic] : []),
    ],
    queryFn: () =>
      fetchOrdersListing<CboResponseType>({
        mode: "cbo",
        startDate,
        endDate,
        month: filterValue?.month,
        policy_status: filterValue?.policy_status,
        contact: filterValue?.contact,
        api_user_id: filterValue?.api_user_id,
        branch_id: filterValue?.branch_id,
        payment_mode_id: filterValue?.payment_mode_id,
        product_id: filterValue?.product_id,
        cnic: filterValue?.cnic,
      }),
  });

  // ======== MUTATION ========
  const singleOrderMutation = useMutation<
    SingleOrderResponseTypes,
    AxiosError<SingleOrderResponseTypes>,
    { orderId: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: `/orders/single`,
        data: { order_code: record.orderId },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add single order mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      if (data?.payload && data.payload.length > 0) {
        setSingleOrderData(data?.payload[0] || null);
        setDialogOpen(true);
      } else {
        toast.error("No order details found.");
      }
    },
  });

  // ======== PAYLOADS DATA ========
  const cboList = useMemo(
    () => cobListResponse?.payload || [],
    [cobListResponse]
  );

  const apiUserList = useMemo(
    () => apiUserListResponse?.payload || [],
    [apiUserListResponse]
  );

  const productList = useMemo(
    () => productListResponse?.payload || [],
    [productListResponse]
  );

  const branchList = useMemo(
    () => branchListResponse?.payload || [],
    [branchListResponse]
  );

  const paymentModesList = useMemo(
    () => paymentModesListresponse?.payload || [],
    [paymentModesListresponse]
  );

  // ======== HANDLERS ========
  const handleSingleOrderFetch = useCallback(
    (orderId: string) => {
      singleOrderMutation.mutate({ orderId });
    },
    [singleOrderMutation]
  );

  const handlePolicyStatusDialog = useCallback(
    (policyId: number) => {
      setStatusDialogOpen(true);
      setIsPolicyId(policyId);
    },
    [setStatusDialogOpen, setIsPolicyId]
  );

  const handleRefetch = useCallback(async () => {
    const toastId = "cbo-list-refetch-toast";

    toast.loading("Refetching...", { id: toastId });

    try {
      const { isSuccess } = await cboListRefetch();

      if (isSuccess) {
        toast.success("Refetched Successfully!", { id: toastId });
      } else {
        toast.error("Failed to fetch data.", { id: toastId });
      }
    } catch (error) {
      toast.error(`${error}: An error occurred.`, { id: toastId });
    }
  }, [cboListRefetch]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<CboPayloadType>[] = useMemo(
    () => [
      {
        accessorKey: "order_code",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Order #" />
        ),
        cell: ({ row }) => <div>{row.original.order_code || "N/A"}</div>,
      },
      {
        accessorKey: "policy_number",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Policy #" />
        ),
        cell: ({ row }) => <div>{row.original.policy_number || "N/A"}</div>,
      },
      {
        accessorKey: "create_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Create Date" />
        ),
        cell: ({ row }) => {
          if (!row.original.create_date) return <div>N/A</div>;
          return (
            <div>
              {format(new Date(row.original.create_date), "MMM dd, yyyy")}
            </div>
          );
        },
      },
      {
        accessorKey: "issue_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Issue Date" />
        ),
        cell: ({ row }) => {
          if (!row.original.issue_date) return <div>N/A</div>;
          return (
            <div>
              {format(new Date(row.original.issue_date), "MMM dd, yyyy")}
            </div>
          );
        },
      },
      {
        accessorKey: "expiry_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Expiry Date" />
        ),
        cell: ({ row }) => {
          if (!row.original.expiry_date) return <div>N/A</div>;
          return (
            <div>
              {format(new Date(row.original.expiry_date), "MMM dd, yyyy")}
            </div>
          );
        },
      },
      {
        accessorKey: "premium",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Premium" />
        ),
        accessorFn: (row) => row?.premium,
        cell: ({ row }) => {
          const amount = row.original.premium;
          return (
            <div className="text-center">
              {amount ? formatNumberCell(amount) : "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "customer_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Customer Name" />
        ),
        cell: ({ row }) => <div>{row.original.customer_name || "N/A"}</div>,
      },
      {
        accessorKey: "customer_contact",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Customer Contact" />
        ),
        cell: ({ row }) => <div>{row.original.customer_contact || "N/A"}</div>,
      },
      {
        accessorKey: "branch_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Branch Name" />
        ),
        cell: ({ row }) => (
          <div className="truncate w-40">
            {row.original.branch_name || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "product",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Product" />
        ),
        cell: ({ row }) => (
          <div className="line-clamp-2 w-[300px] whitespace-break-spaces">
            {row.original.product || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "no_of_persons_covered",
        header: ({ column }) => (
          <DatatableColumnHeader
            column={column}
            title="No of Persons Covered"
          />
        ),
        cell: ({ row }) => (
          <div className="truncate text-center w-40">
            {row.original.no_of_persons_covered || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "payment_mode",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Payment Mode" />
        ),
        cell: ({ row }) => (
          <div className="truncate w-40">
            {row.original.payment_mode || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "policy_category",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Policy Category" />
        ),
        cell: ({ row }) => (
          <div className="truncate text-center w-40">
            {row.original.policy_category || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "pec_coverage",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="PEC Coverage" />
        ),
        cell: ({ row }) => (
          <div className="truncate text-center w-40">
            {row.original.pec_coverage || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "renewal_number",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Renewal Number" />
        ),
        cell: ({ row }) => (
          <div className="truncate text-center w-40">
            {row.original.renewal_number || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "policy_status",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Policy Status" />
        ),
        accessorFn: (row) => row.policy_status || "N/A",
        cell: ({ row }) => {
          const status = row.original.policy_status.toLowerCase();
          return (
            <Badge
              variant={
                status as
                  | "cancelled"
                  | "hisposted"
                  | "igisposted"
                  | "pendingigis"
                  | "unverified"
                  | "verified"
                  | "pending"
                  | "pendingcod"
                  | "pendingcbo"
              }
            >
              {row.original.policy_status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isCurrentOrderLoading =
            singleOrderMutation.isPending &&
            singleOrderMutation.variables?.orderId === row.original.order_code;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {rights?.can_view === "1" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleSingleOrderFetch(row.original.order_code)
                    }
                    disabled={isCurrentOrderLoading}
                  >
                    <span>View Details</span>
                  </DropdownMenuItem>
                )}
                {rights?.can_edit === "1" &&
                  row?.original.policy_status.toLocaleLowerCase() ===
                    "pendingcbo" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handlePolicyStatusDialog(row.original?.policy_id)
                      }
                    >
                      <span>Change Status</span>
                    </DropdownMenuItem>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [
      rights,
      handleSingleOrderFetch,
      singleOrderMutation,
      handlePolicyStatusDialog,
    ]
  );

  // ======== RENDER LOGIC ========
  const isLoading =
    cboListIsLoading ||
    apiUserListLoading ||
    productListLoading ||
    branchListLoading ||
    paymentModesListLoading;
  const isError =
    cboListIsError ||
    apiUserListIsError ||
    productListIsError ||
    branchListIsError ||
    paymentModesListIsError;
  const onError =
    cboListError?.message ||
    apiUserListError?.message ||
    productListError?.message ||
    branchListError?.message ||
    paymentModesListError?.message;

  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (rights && rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav
        title="CBO List"
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filter={true}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        isExportZipOpen={isExportZipOpen}
        setIsExportZipOpen={setIsExportZipOpen}
        exportZip={true}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <Error err={onError} />
      ) : (
        <CboDatatable
          columns={columns}
          payload={cboList}
          isRefetching={cboListIsRefetching}
          handleRefetch={handleRefetch}
        />
      )}

      <OrdersFilters
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={() => setIsFilterOpen(false)}
        apiUserList={apiUserList}
        productList={productList}
        branchList={branchList}
        paymentModesList={paymentModesList}
      />

      <GenerateHis
        isExportZipOpen={isExportZipOpen}
        setIsExportZipOpen={setIsExportZipOpen}
      />

      {!isLoading && (
        <ChangeCBOPolicyStatus
          statusDialogOpen={statusDialogOpen}
          setStatusDialogOpen={setStatusDialogOpen}
          policyId={isPolicyId}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      <SingleOrderDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderSingleData={orderSingleData}
      />
    </>
  );
};

export default CboList;
