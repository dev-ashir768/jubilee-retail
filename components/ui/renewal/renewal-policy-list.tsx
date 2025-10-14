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
import RenewalPolicyDatatable from "./renewal-policy-datatable";
import {
  RenewalPolicyPayloadType,
  RenewalPolicyResponseType,
} from "@/types/renewalPolicyTypes";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";

const RenewalPolicyList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/renewals";
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
    data: renewalPolicyListResponse,
    isLoading: renewalPolicyListIsLoading,
    isError: renewalPolicyListIsError,
    error: renewalPolicyListError,
  } = useQuery<RenewalPolicyResponseType | null>({
    queryKey: ["renewal-policy-list", `${startDate} to ${endDate}`],
    queryFn: () =>
      fetchOrdersListing<RenewalPolicyResponseType>({
        mode: "renewal",
        startDate,
        endDate,
      }),
  });

  // ======== PAYLOADS DATA ========
  // const apiUserList = useMemo(
  //   () => apiUserListResponse?.payload || [],
  //   [apiUserListResponse]
  // );

  const renewalPolicyList = useMemo(
    () => renewalPolicyListResponse?.payload || [],
    [renewalPolicyListResponse]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<RenewalPolicyPayloadType>[] = useMemo(
    () => [
      {
        accessorKey: "policy_number",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Policy #" />
        ),
        cell: ({ row }) => <div>{row.original.policy_number || "N/A"}</div>,
      },
      {
        accessorKey: "customer_name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Customer Name" />
        ),
        cell: ({ row }) => <div>{row.original.customer_name || "N/A"}</div>,
      },
      {
        accessorKey: "product",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Product" />
        ),
        cell: ({ row }) => (
          <div className="truncate w-40">{row.original.product || "N/A"}</div>
        ),
      },
      {
        accessorKey: "premium",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Premium" />
        ),
        cell: ({ row }) => <div>{row.original.premium || "N/A"}</div>,
      },
      {
        accessorKey: "issue_date",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Issue Date" />
        ),
        cell: ({ row }) => {
          if (!row.original.issue_date) return <div>N/A</div>;
          const date = new Date(row.original.issue_date);
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
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Action" />
        ),
        cell: ({ row }) => {
          return (
            rights?.can_view === "1" && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  console.log("Viewing Renewal policy:", row.original.id)
                }
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
  const isLoading = renewalPolicyListIsLoading;
  const isError = renewalPolicyListIsError;
  const onError = renewalPolicyListError?.message;

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
        title="Renewal Policy List"
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <RenewalPolicyDatatable columns={columns} payload={renewalPolicyList} />
    </>
  );
};

export default RenewalPolicyList;
