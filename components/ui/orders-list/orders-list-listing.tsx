"use client";

import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
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
import { subDays, format } from "date-fns";
import { ApiUsersResponseType } from "@/types/usersTypes";
import { fetchApiUserList } from "@/helperFunctions/userFunction";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { fetchProductsList } from "@/helperFunctions/productsFunction";
import { fetchBranchList } from "@/helperFunctions/branchFunction";
import { BranchResponseType } from "@/types/branchTypes";
import { PaymentModesResponseType } from "@/types/paymentModesTypes";
import { fetchPaymentModesList } from "@/helperFunctions/paymentModesFunction";
import OrdersFilters from "../filters/orders-filters";
import { ordersListFilterState } from "@/hooks/ordersListFilterState";

const OrdersListListing = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/list";
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filterValue } = ordersListFilterState();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 364),
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
    queryKey: ["api-user-list"],
    queryFn: fetchApiUserList,
  });

  const {
    data: productListResponse,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["products-list"],
    queryFn: fetchProductsList,
  });

  const {
    data: branchListResponse,
    isLoading: branchListLoading,
    isError: branchListIsError,
    error: branchListError,
  } = useQuery<BranchResponseType | null>({
    queryKey: ["branch-list"],
    queryFn: fetchBranchList,
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
      `${startDate} to ${endDate}`,
      filterValue?.month,
      filterValue?.order_status,
      filterValue?.contact,
      filterValue?.api_user_id,
      filterValue?.branch_id,
      filterValue?.payment_mode_id,
      filterValue?.product_id,
      filterValue?.cnic,
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

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<OrdersListPayloadType>[] = React.useMemo(
    () => [
      {
        accessorKey: "order_code",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Order Code" />
        ),
        cell: ({ row }) => <div>{row.original.order_code}</div>,
      },
      {
        accessorKey: "customer_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Customer Name" />
        ),
        cell: ({ row }) => <div>{row.original.customer_name}</div>,
      },
      {
        accessorKey: "customer_contact",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => <div>{row.original.customer_contact}</div>,
      },
      {
        accessorKey: "premium",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Premium" />
        ),
        cell: ({ row }) => <div>{row.original.premium}</div>,
      },
      {
        accessorKey: "payment_mode",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Payment Mode" />
        ),
        cell: ({ row }) => <div>{row.original.payment_mode}</div>,
      },
      {
        accessorKey: "branch_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Branch" />
        ),
        cell: ({ row }) => <div>{row.original.branch_name}</div>,
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
        accessorKey: "create_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.create_date);
          return <div>{date.toLocaleDateString()}</div>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            rights?.can_view === "1" && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => console.log("view id:", row.original.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )
          );
        },
      },
    ],
    [rights]
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
    </>
  );
};

export default OrdersListListing;
