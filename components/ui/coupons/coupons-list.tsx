"use client";

import { fetchCouponsList } from "@/helperFunctions/couponsFunction";
import { CouponsPayloadType, CouponsResponseType } from "@/types/couponsTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Trash } from "lucide-react";
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
import CouponsDatatable from "./coupons-datatable";

const CouponsList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/coupons-management/add-coupons";
  const LISTING_ROUTE = "/coupons-management/coupons";
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: couponsListResponse,
    isLoading: couponsListLoading,
    isError: couponsListIsError,
    error: couponsListError,
  } = useQuery<CouponsResponseType | null>({
    queryKey: ["coupons-list"],
    queryFn: fetchCouponsList,
  });

  // ======== PAYLOADS DATA ========
  const couponsList = useMemo(
    () => couponsListResponse?.payload || [],
    [couponsListResponse]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<CouponsPayloadType>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Code" />
        ),
        cell: ({ row }) => <div>{row.original.code}</div>,
      },
      {
        accessorKey: "campaign_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Campaign Name" />
        ),
        cell: ({ row }) => <div>{row.original.campaign_name}</div>,
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Quantity" />
        ),
        cell: ({ row }) => <div>{row.original.quantity}</div>,
      },
      {
        accessorKey: "coupon_type",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Coupon Type" />
        ),
        cell: ({ row }) => <div>{row.original.coupon_type}</div>,
      },
      {
        accessorKey: "discount_value",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Discount Value" />
        ),
        cell: ({ row }) => <div>{row.original.discount_value}</div>,
        // filterFn: "multiSelect",
        // meta: {
        //   filterType: "multiselect",
        //   filterOptions: discountValueFilterOptions,
        //   filterPlaceholder: "Filter by discount value...",
        // } as ColumnMeta,
      },
      {
        accessorKey: "use_per_customer",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Use Per Customer" />
        ),
        cell: ({ row }) => <div>{row.original.use_per_customer}</div>,
      },
      {
        accessorKey: "remaining",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Remaining" />
        ),
        cell: ({ row }) => <div>{row.original.remaining}</div>,
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Status" />
        ),
        accessorFn: (row) => (row.is_active ? "active" : "inactive"),
        cell: ({ row }) => {
          const status = row.getValue("is_active") as string;
          return (
            <Badge variant={status === "active" ? "success" : "danger"}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {rights?.can_edit === "1" && (
                  <DropdownMenuItem>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [rights]
  );

  // ======== RENDER LOGIC ========
  const isLoading = couponsListLoading;
  const isError = couponsListIsError;
  const onError = couponsListError?.message;

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
      <SubNav
        title="Coupons List"
        addBtnTitle="Add Coupon"
        urlPath={ADD_ROUTE}
      />

      <CouponsDatatable columns={columns} payload={couponsList} />
    </>
  );
};

export default CouponsList;
