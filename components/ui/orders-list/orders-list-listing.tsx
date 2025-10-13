"use client";

import { CouponsPayloadType, CouponsResponseType } from "@/types/couponsTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { Badge } from "../shadcn/badge";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import SubNav from "../foundations/sub-nav";
import { fetchApiUserList } from "@/helperFunctions/userFunction";
import { ApiUsersResponseType } from "@/types/usersTypes";
import OrdersListDatatable from "./orders-list-datatable";
import {
  OrdersListPayloadType,
  OrdersListResponseType,
} from "@/types/ordersListTypes";
import { fetchOrdersListing } from "@/helperFunctions/ordersFunctions";

const OrdersListListing = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/list";
  const router = useRouter();

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
    data: ordersListListingResponse,
    isLoading: ordersListListingLoading,
    isError: ordersListListingIsError,
    error: ordersListListingError,
  } = useQuery<OrdersListResponseType | null>({
    queryKey: ["orders-list-linting"],
    queryFn: () =>
      fetchOrdersListing<OrdersListResponseType>({
        mode: "orders",
      }),
  });

  // ======== PAYLOADS DATA ========
  const apiUserList = useMemo(
    () => apiUserListResponse?.payload || [],
    [apiUserListResponse]
  );

  const ordersListListing = useMemo(
    () => ordersListListingResponse?.payload || [],
    [ordersListListingResponse]
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
  const isLoading = apiUserListLoading || ordersListListingLoading;
  const isError = apiUserListIsError || ordersListListingIsError;
  const onError = apiUserListError?.message || ordersListListingError?.message;

  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights && rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav title="Orders List" />

      <OrdersListDatatable columns={columns} payload={ordersListListing} />
    </>
  );
};

export default OrdersListListing;
