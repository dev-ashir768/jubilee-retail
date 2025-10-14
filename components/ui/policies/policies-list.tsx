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
import { fetchOrdersListing } from "@/helperFunctions/ordersFunctions";
import {
  PoliciesPayloadType,
  PoliciesResponseType,
} from "@/types/policiesTypes";
import PoliciesDatatable from "./policies-datatable";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";

const PoliciesList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/policies";
  const router = useRouter();
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
  // const {
  //   data: apiUserListResponse,
  //   isLoading: apiUserListLoading,
  //   isError: apiUserListIsError,
  //   error: apiUserListError,
  // } = useQuery<ApiUsersResponseType | null>({
  //   queryKey: ["api-user-list"],
  //   queryFn: fetchApiUserList,
  // });

  const {
    data: policiesListResponse,
    isLoading: policiesListIsLoading,
    isError: policiesListIsError,
    error: policiesListError,
  } = useQuery<PoliciesResponseType | null>({
    queryKey: ["policies-list", `${startDate} to ${endDate}`],
    queryFn: () =>
      fetchOrdersListing<PoliciesResponseType>({
        mode: "policies",
        startDate,
        endDate,
      }),
  });

  // ======== PAYLOADS DATA ========
  // const apiUserList = useMemo(
  //   () => apiUserListResponse?.payload || [],
  //   [apiUserListResponse]
  // );

  const policiesList = useMemo(
    () => policiesListResponse?.payload || [],
    [policiesListResponse]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<PoliciesPayloadType>[] = React.useMemo(
    () => [
      {
        accessorKey: "policy_number",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Policy #" />
        ),
        accessorFn: (row) => row.policy_number || "N/A",
        cell: ({ row }) => <div>{row.original.policy_number}</div>,
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
        accessorKey: "product",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Product" />
        ),
        accessorFn: (row) => row.product || "N/A",
        cell: ({ row }) => (
          <div className="truncate w-32">{row.original.product}</div>
        ),
      },
      {
        accessorKey: "premium",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Premium" />
        ),
        accessorFn: (row) => row.premium || "N/A",
        cell: ({ row }) => <div>{row.original.premium}</div>,
      },
      {
        accessorKey: "issue_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Issue Date" />
        ),
        accessorFn: (row) => row.issue_date || "N/A",
        cell: ({ row }) => {
          const date = new Date(row.original.issue_date);
          return <div>{date.toLocaleDateString()}</div>;
        },
      },
      {
        accessorKey: "expiry_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Expiry Date" />
        ),
        accessorFn: (row) => row.expiry_date || "N/A",
        cell: ({ row }) => {
          const date = new Date(row.original.expiry_date);
          return <div>{date.toLocaleDateString()}</div>;
        },
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
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right">
              {rights?.can_view === "1" && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    console.log("Viewing policy:", row.original.id)
                  }
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [rights]
  );

  // ======== RENDER LOGIC ========
  const isLoading =  policiesListIsLoading;
  const isError =  policiesListIsError;
  const onError =  policiesListError?.message;

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
        title="Policies List"
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <PoliciesDatatable columns={columns} payload={policiesList} />
    </>
  );
};

export default PoliciesList;
