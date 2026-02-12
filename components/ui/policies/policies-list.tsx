"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
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
import {
  PoliciesPayloadType,
  PoliciesResponseType,
} from "@/types/policiesTypes";
import PoliciesDatatable from "./policies-datatable";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import { ApiUsersResponseType } from "@/types/usersTypes";
import { fetchAllApiUserList } from "@/helperFunctions/userFunction";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { fetchAllProductsList } from "@/helperFunctions/productsFunction";
import { BranchResponseType } from "@/types/branchTypes";
import { fetchAllBranchList } from "@/helperFunctions/branchFunction";
import { PaymentModesResponseType } from "@/types/paymentModesTypes";
import { fetchPaymentModesList } from "@/helperFunctions/paymentModesFunction";
import { policyListFilterState } from "@/hooks/policyListFilterState";
import OrdersFilters from "../filters/orders-filters";
import {
  SingleOrderPayloadTypes,
  SingleOrderResponseTypes,
} from "@/types/singleOrderType";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import SingleOrderDetailDialog from "../modal-dialog/single-order-detail-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import ChangeStatusDialog from "./change-stataus-dialog";
import { AgentResponseTypes } from "@/types/agentTypes";
import { ClientResponseType } from "@/types/clientTypes";
import { fetchAllClientList } from "@/helperFunctions/clientFunction";
import { fetchAllAgentList } from "@/helperFunctions/agentFunction";
import { formatNumberCell } from "@/utils/numberFormaterFunction";
import { getUserInfo } from "@/utils/getUserInfo";

const PoliciesList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/policies";
  const userInfo = getUserInfo();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filterValue } = policyListFilterState();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isPolicyId, setIsPolicyId] = useState<number>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderSingleData, setSingleOrderData] =
    useState<SingleOrderPayloadTypes | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";
  const defaultRange = {
    from: startOfMonth(new Date()),
    to: new Date(),
  };

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
    data: policiesListResponse,
    isLoading: policiesListIsLoading,
    isError: policiesListIsError,
    error: policiesListError,
    refetch: policiesListRefetch,
    isRefetching: policiesListIsRefetching,
  } = useQuery<PoliciesResponseType | null>({
    queryKey: [
      "policies-list",
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
      fetchOrdersListing<PoliciesResponseType>({
        mode: "policies",
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
    onMutate: () => {
      toast.success("Fetching order details...");
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

  const {
    data: agentListResponse,
    isLoading: agentListLoading,
    isError: agentListIsError,
    error: agentListError,
  } = useQuery<AgentResponseTypes | null>({
    queryKey: ["all-agent-list"],
    queryFn: fetchAllAgentList,
  });

  const {
    data: clientListResponse,
    isLoading: clientListLoading,
    isError: clientListIsError,
    error: clientListError,
  } = useQuery<ClientResponseType | null>({
    queryKey: ["all-client-list"],
    queryFn: fetchAllClientList,
  });

  // ======== PAYLOADS DATA ========
  const policiesList = useMemo(
    () => policiesListResponse?.payload || [],
    [policiesListResponse],
  );

  const apiUserList = useMemo(
    () => apiUserListResponse?.payload || [],
    [apiUserListResponse],
  );

  const productList = useMemo(
    () => productListResponse?.payload || [],
    [productListResponse],
  );

  const branchList = useMemo(
    () => branchListResponse?.payload || [],
    [branchListResponse],
  );

  const agentList = useMemo(
    () => agentListResponse?.payload || [],
    [agentListResponse],
  );

  const clientList = useMemo(
    () => clientListResponse?.payload || [],
    [clientListResponse],
  );

  const paymentModesList = useMemo(
    () => paymentModesListresponse?.payload || [],
    [paymentModesListresponse],
  );

  // ======== HANDLERS ========
  const handleSingleOrderFetch = useCallback(
    (orderId: string) => {
      return singleOrderMutation.mutate({ orderId });
    },
    [singleOrderMutation],
  );

  const handlePolicyStatusDialog = useCallback(
    (policyId: number) => {
      setStatusDialogOpen(true);
      setIsPolicyId(policyId);
    },
    [setStatusDialogOpen, setIsPolicyId],
  );

  const handleRefetch = useCallback(async () => {
    const toastId = "policy-list-refetch-toast";

    toast.loading("Refetching...", { id: toastId });

    try {
      const { isSuccess } = await policiesListRefetch();

      if (isSuccess) {
        toast.success("Fetched Successfully!", { id: toastId });
      } else {
        toast.error("Failed to fetch data.", { id: toastId });
      }
    } catch (error) {
      toast.error(`${error}: An error occurred.`, { id: toastId });
    }
  }, [policiesListRefetch]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<PoliciesPayloadType>[] = useMemo(
    () => [
      {
        accessorKey: "order_code",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Order #" />
        ),
        accessorFn: (row) => row.order_code || "N/A",
        cell: ({ row }) => <div>{row.original.order_code}</div>,
      },
      {
        accessorKey: "policy_number",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Policy #" />
        ),
        accessorFn: (row) => row.policy_number || "N/A",
        cell: ({ row }) => <div>{row.original.policy_number}</div>,
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
        accessorKey: "premium",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Premium" />
        ),
        accessorFn: (row) => row?.premium,
        cell: ({ row }) => {
          const amount = row.original.premium;
          return <div>{amount ? formatNumberCell(amount) : "N/A"}</div>;
        },
      },
      {
        accessorKey: "customer_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Customer Name" />
        ),
        accessorFn: (row) => row.customer_name || "N/A",
        cell: ({ row }) => <div>{row.original.customer_name}</div>,
      },
      {
        accessorKey: "customer_contact",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Customer Contact" />
        ),
        accessorFn: (row) => row.customer_contact || "N/A",
        cell: ({ row }) => <div>{row.original.customer_contact}</div>,
      },
      {
        accessorKey: "customer_cnic",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Customer Cnic" />
        ),
        accessorFn: (row) => row.customer_cnic || "N/A",
        cell: ({ row }) => <div>{row.original.customer_cnic}</div>,
      },
      {
        accessorKey: "branch_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Branch Name" />
        ),
        accessorFn: (row) => row.branch_name || "N/A",
        cell: ({ row }) => <div>{row.original.branch_name}</div>,
      },
      {
        accessorKey: "product",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Product" />
        ),
        accessorFn: (row) => row.product || "N/A",
        cell: ({ row }) => <div>{row.original.product}</div>,
      },
      {
        accessorKey: "payment_mode",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Payment Mode" />
        ),
        accessorFn: (row) => row.payment_mode || "N/A",
        cell: ({ row }) => <div>{row.original.payment_mode}</div>,
      },
      {
        accessorKey: "api_user_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Api User Name" />
        ),
        accessorFn: (row) => row.api_user_name || "N/A",
        cell: ({ row }) => (
          <div className="capitalize">{row.original.api_user_name}</div>
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
                    "pendingigis" && (
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
    ],
  );

  // ======== RENDER LOGIC ========
  const isLoading =
    policiesListIsLoading ||
    apiUserListLoading ||
    productListLoading ||
    branchListLoading ||
    paymentModesListLoading ||
    clientListLoading ||
    agentListLoading;
  const isError =
    policiesListIsError ||
    apiUserListIsError ||
    productListIsError ||
    branchListIsError ||
    agentListIsError ||
    clientListIsError ||
    paymentModesListIsError;
  const onError =
    policiesListError?.message ||
    apiUserListError?.message ||
    productListError?.message ||
    branchListError?.message ||
    paymentModesListError?.message ||
    clientListError?.message ||
    agentListError?.message;

  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect(userInfo?.redirection_url ? userInfo.redirection_url : "/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, userInfo]);

  if ((rights && rights?.can_view === "0") || !rights?.can_view)
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav
        title="Policies List"
        datePicker={true}
        dateRange={dateRange}
        defaultDate={defaultRange}
        setDateRange={setDateRange}
        filter={true}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <Error err={onError} />
      ) : (
        <PoliciesDatatable
          columns={columns}
          payload={policiesList}
          handleRefetch={handleRefetch}
          isRefetching={policiesListIsRefetching}
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

      {!isLoading && (
        <ChangeStatusDialog
          statusDialogOpen={statusDialogOpen}
          setStatusDialogOpen={setStatusDialogOpen}
          branchList={branchList}
          agentList={agentList}
          clientList={clientList}
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

export default PoliciesList;
