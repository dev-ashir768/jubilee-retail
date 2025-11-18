"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import OrdersListDatatable from "./orders-list-datatable";
import {
  OrdersListPayloadType,
  OrdersListResponseType,
} from "@/types/ordersListTypes";
import { fetchOrdersListing } from "@/helperFunctions/ordersFunctions";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import { ApiUsersResponseType } from "@/types/usersTypes";
import { fetchAllApiUserList } from "@/helperFunctions/userFunction";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { fetchAllBranchList } from "@/helperFunctions/branchFunction";
import { BranchResponseType } from "@/types/branchTypes";
import { PaymentModesResponseType } from "@/types/paymentModesTypes";
import { fetchPaymentModesList } from "@/helperFunctions/paymentModesFunction";
import OrdersFilters from "../filters/orders-filters";
import { ordersListFilterState } from "@/hooks/ordersListFilterState";
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
import { OrderVerifyManuallyResponseTypes } from "@/types/orderVerifyManuallyTypes";
import { fetchAllProductsList } from "@/helperFunctions/productsFunction";
import { formatNumberCell } from "@/utils/numberFormaterFunction";

const OrdersListListing = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/list";
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filterValue } = ordersListFilterState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
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
    data: ordersListListingResponse,
    isLoading: ordersListListingLoading,
    isError: ordersListListingIsError,
    error: ordersListListingError,
  } = useQuery<OrdersListResponseType | null>({
    queryKey: [
      "orders-list-linting",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
      ...(filterValue?.month ? [filterValue.month] : []),
      ...(filterValue?.order_status ? [filterValue.order_status] : []),
      ...(filterValue?.contact ? [filterValue.contact] : []),
      ...(filterValue?.api_user_id ? [filterValue.api_user_id] : []),
      ...(filterValue?.branch_id ? [filterValue.branch_id] : []),
      ...(filterValue?.payment_mode_id ? [filterValue.payment_mode_id] : []),
      ...(filterValue?.product_id ? [filterValue.product_id] : []),
      ...(filterValue?.cnic ? [filterValue.cnic] : []),
    ],
    queryFn: () =>
      fetchOrdersListing<OrdersListResponseType>({
        mode: "orders",
        startDate,
        endDate,
        month: filterValue?.month,
        order_status: filterValue?.order_status,
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
      setSingleOrderData(data?.payload[0] || null);
      setDialogOpen(true);
      toast.success(message);
    },
  });

  const orderVerifyManuallyMutation = useMutation<
    OrderVerifyManuallyResponseTypes,
    AxiosError<OrderVerifyManuallyResponseTypes>,
    { order_code: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: `/orders/verify-manually`,
        data: { order_code: record.order_code },
        isServer: true,
      });
    },
    onMutate: () => {
      toast.success("Verifying order manually...");
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Manually Order verification error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: [
          "orders-list-linting",
          ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
          ...(filterValue?.month ? [filterValue.month] : []),
          ...(filterValue?.order_status ? [filterValue.order_status] : []),
          ...(filterValue?.contact ? [filterValue.contact] : []),
          ...(filterValue?.api_user_id ? [filterValue.api_user_id] : []),
          ...(filterValue?.branch_id ? [filterValue.branch_id] : []),
          ...(filterValue?.payment_mode_id
            ? [filterValue.payment_mode_id]
            : []),
          ...(filterValue?.product_id ? [filterValue.product_id] : []),
          ...(filterValue?.cnic ? [filterValue.cnic] : []),
        ],
      });
    },
  });

  const orderRepushMutation = useMutation<
    OrderVerifyManuallyResponseTypes,
    AxiosError<OrderVerifyManuallyResponseTypes>,
    { order_code: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: `/orders/repush`,
        data: { order_code: record.order_code },
        isServer: true,
      });
    },
    onMutate: () => {
      toast.success("Repushing order...");
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Order repush error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: [
          "orders-list-linting",
          ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
          ...(filterValue?.month ? [filterValue.month] : []),
          ...(filterValue?.order_status ? [filterValue.order_status] : []),
          ...(filterValue?.contact ? [filterValue.contact] : []),
          ...(filterValue?.api_user_id ? [filterValue.api_user_id] : []),
          ...(filterValue?.branch_id ? [filterValue.branch_id] : []),
          ...(filterValue?.payment_mode_id
            ? [filterValue.payment_mode_id]
            : []),
          ...(filterValue?.product_id ? [filterValue.product_id] : []),
          ...(filterValue?.cnic ? [filterValue.cnic] : []),
        ],
      });
    },
  });

  // ======== PAYLOADS DATA ========
  const ordersListListing = useMemo(
    () => ordersListListingResponse?.payload || [],
    [ordersListListingResponse]
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

  const handleOrderVerifyManually = useCallback(
    (order_code: string) => {
      orderVerifyManuallyMutation.mutate({ order_code });
    },
    [orderVerifyManuallyMutation]
  );

  const handleOrderRepush = useCallback(
    (order_code: string) => {
      orderRepushMutation.mutate({ order_code });
    },
    [orderRepushMutation]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<OrdersListPayloadType>[] = useMemo(
    () => [
      {
        accessorKey: "order_code",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Order Code" />
        ),
        cell: ({ row }) => <div>{row.original.order_code}</div>,
      },
      {
        accessorKey: "create_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.create_date);
          return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
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
        cell: ({ row }) => <div>{row.original.customer_name || "N/A"}</div>,
      },
      {
        accessorKey: "customer_contact",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => <div>{row.original.customer_contact || "N/A"}</div>,
      },
      {
        accessorKey: "branch_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Branch" />
        ),
        cell: ({ row }) => <div>{row.original.branch_name || "N/A"}</div>,
      },
      {
        accessorKey: "cnno",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="CN Number" />
        ),
        cell: ({ row }) => <div>{row.original.cnno || "N/A"}</div>,
      },
      {
        accessorKey: "payment_mode",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Payment Mode" />
        ),
        cell: ({ row }) => <div>{row.original.payment_mode || "N/A"}</div>,
      },
      {
        accessorKey: "payment_code",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Payment Code" />
        ),
        cell: ({ row }) => <div>{row.original.payment_code || "N/A"}</div>,
      },
      {
        accessorKey: "api_user_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="API User Name" />
        ),
        cell: ({ row }) => <div>{row.original.api_user_name || "N/A"}</div>,
      },
      {
        accessorKey: "order_status",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.order_status.toLowerCase();
          return (
            <Badge
              variant={
                status as
                  | "accepted"
                  | "cancelled"
                  | "pendingcod"
                  | "rejected"
                  | "unverified"
                  | "verified"
                  | "pending"
              }
            >
              {row.original.order_status}
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
                {row?.original.payment_code.toLocaleLowerCase() === "cc" &&
                  row?.original.order_status.toLocaleLowerCase() ===
                    "unverified" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleOrderVerifyManually(row.original.order_code)
                      }
                    >
                      <span>Approve Order</span>
                    </DropdownMenuItem>
                  )}
                {row?.original.payment_code.toLocaleLowerCase() === "cod" &&
                  row?.original.order_status.toLocaleLowerCase() ===
                    "unverified" && (
                    <DropdownMenuItem
                      onClick={() => handleOrderRepush(row.original.order_code)}
                    >
                      <span>Repush to Orio</span>
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
      handleOrderRepush,
      handleOrderVerifyManually,
    ]
  );

  // ======== RENDER LOGIC ========
  const isLoading =
    ordersListListingLoading ||
    apiUserListLoading ||
    productListLoading ||
    branchListLoading ||
    paymentModesListLoading;
  const isError =
    ordersListListingIsError ||
    apiUserListIsError ||
    productListIsError ||
    branchListIsError ||
    paymentModesListIsError;
  const onError =
    ordersListListingError?.message ||
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
        title="Orders List"
        addBtnTitle="Create Order"
        urlPath="/orders/create-order"
        filter={true}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <Error err={onError} />
      ) : (
        <OrdersListDatatable columns={columns} payload={ordersListListing} />
      )}

      <OrdersFilters
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={() => setIsFilterOpen(false)}
        apiUserList={apiUserList}
        productList={productList}
        branchList={branchList}
        paymentModesList={paymentModesList}
      />

      <SingleOrderDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderSingleData={orderSingleData}
      />
    </>
  );
};

export default OrdersListListing;
