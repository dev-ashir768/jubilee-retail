"use client";

import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
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
import { fetchOrdersListing } from "@/helperFunctions/ordersFunctions";
import { CboPayloadType, CboResponseType } from "@/types/cboTypes";
import CboDatatable from "./cbo-datatable";

const CboList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/orders/cbo";
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
    data: cobListResponse,
    isLoading: cboListIsLoading,
    isError: cboListIsError,
    error: cboListError,
  } = useQuery<CboResponseType | null>({
    queryKey: ["cbo-list"],
    queryFn: () =>
      fetchOrdersListing<CboResponseType>({
        mode: "cbo",
      }),
  });

  // ======== PAYLOADS DATA ========
  const apiUserList = useMemo(
    () => apiUserListResponse?.payload || [],
    [apiUserListResponse]
  );

  const cboList = useMemo(
    () => cobListResponse?.payload || [],
    [cobListResponse]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<CboPayloadType>[] = useMemo(
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
                  console.log("Viewing CBO policy:", row.original.id)
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
  const isLoading = apiUserListLoading || cboListIsLoading;
  const isError = apiUserListIsError || cboListIsError;
  const onError = apiUserListError?.message || cboListError?.message;

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
      <SubNav title="CBO List" />
      <CboDatatable columns={columns} payload={cboList} />
    </>
  );
};

export default CboList;
