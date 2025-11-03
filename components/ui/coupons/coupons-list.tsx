"use client";

import { fetchCouponsList } from "@/helperFunctions/couponsFunction";
import { CouponsPayloadType, CouponsResponseType } from "@/types/couponsTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
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
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { couponFilterState } from "@/hooks/couponFilterState";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { fetchAllProductsList } from "@/helperFunctions/productsFunction";
import CouponFilters from "../filters/coupon-filter";

const CouponsList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/coupons-management/add-coupons";
  const LISTING_ROUTE = "/coupons-management/coupons";
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const defaultDaysBack = 366;
  const { filterValue } = couponFilterState();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), defaultDaysBack),
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
    data: couponsListResponse,
    isLoading: couponsListLoading,
    isError: couponsListIsError,
    error: couponsListError,
  } = useQuery<CouponsResponseType | null>({
    queryKey: [
      "coupons-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
      ...(filterValue?.product_id ? [filterValue?.product_id] : []),
    ],
    queryFn: () =>
      fetchCouponsList({
        startDate,
        endDate,
        product_id: filterValue?.product_id || null,
      }),
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

  // ======== PAYLOADS DATA ========
  const couponsList = useMemo(
    () => couponsListResponse?.payload || [],
    [couponsListResponse]
  );

  const productList = useMemo(
    () => productListResponse?.payload || [],
    [productListResponse]
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
  const isLoading = couponsListLoading || productListLoading;
  const isError = couponsListIsError || productListIsError;
  const onError = couponsListError?.message || productListError?.message;

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
  const renderPageContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isError) {
      return <Error err={onError} />;
    }

    if (!couponsList || couponsList.length === 0) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return <CouponsDatatable columns={columns} payload={couponsList} />;
  };

  return (
    <>
      <SubNav
        title="Coupons List"
        addBtnTitle="Add Coupon"
        urlPath={ADD_ROUTE}
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
        defaultDaysBack={defaultDaysBack}
        filter={true}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {renderPageContent()}

      <CouponFilters
        isFilterOpen={isFilterOpen}
        productList={productList}
        setIsFilterOpen={setIsFilterOpen}
      />
    </>
  );
};

export default CouponsList;
