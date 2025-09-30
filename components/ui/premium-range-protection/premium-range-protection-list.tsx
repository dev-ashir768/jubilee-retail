"use client";

import React, { useEffect, useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { useRouter } from "next/navigation";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import usePremiumRangeProtectionIdStore from "@/hooks/premiumRangeProtectionIdStore";
import { getRights } from "@/utils/getRights";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../shadcn/badge";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import {
  PremiumRangeProtectionsPayloadType,
  PremiumRangeProtectionsResponseType,
} from "@/types/premiumRangeProtectionsTypes";
import { fetchPremiumRangeProtectionsList } from "@/helperFunctions/premiumRangeProtectionsFunction";
import { useQuery } from "@tanstack/react-query";
import PremiumRangeProtectionDatatable from "./premium-range-protection-datatable";
import { createFilterOptions } from "@/utils/filterOptions";

const PremiumRangeProtectionList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-premium-range-protection";
  const EDIT_ROUTE = "/products-plans/edit-premium-range-protection";
  const LISTING_ROUTE = "/products-plans/premium-range-protection";
  const { setPremiumRangeProtectionId } = usePremiumRangeProtectionIdStore();
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: premiumRangeProtectionListResponse,
    isLoading: premiumRangeProtectionListLoading,
    isError: premiumRangeProtectionListIsError,
    error: premiumRangeProtectionListError,
  } = useQuery<PremiumRangeProtectionsResponseType | null>({
    queryKey: ["premium-range-protection-list"],
    queryFn: fetchPremiumRangeProtectionsList,
  });

  // ======== PAYLOADS DATA ========
  const premiumRangeProtectionList = useMemo(
    () => premiumRangeProtectionListResponse?.payload || [],
    [premiumRangeProtectionListResponse]
  );

  // ======== FILTER OPTIONS ========
  const apiUserNameFilterOptions = useMemo(
    () => createFilterOptions(premiumRangeProtectionList, "apiUser.name"),
    [premiumRangeProtectionList]
  );

  const netPremiumFilterOptions = useMemo(
    () => createFilterOptions(premiumRangeProtectionList, "net_premium"),
    [premiumRangeProtectionList]
  );

  const durationFilterOptions = useMemo(
    () => createFilterOptions(premiumRangeProtectionList, "duration"),
    [premiumRangeProtectionList]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<PremiumRangeProtectionsPayloadType>[] = useMemo(
    () => [
      {
        accessorKey: "apiUser.name",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => <div>{row.original.apiUser.name}</div>,
        filterFn: "multiSelect",
        meta: {
          filterType: "multiselect",
          filterOptions: apiUserNameFilterOptions,
          filterPlaceholder: "Filter by API User...",
        } as ColumnMeta,
      },
      {
        accessorKey: "premium_range",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Premium Range" />
        ),
        cell: ({ row }) => (
          <div>{`${row.original.premium_start} - ${row.original.premium_end}`}</div>
        ),
      },
      {
        accessorKey: "net_premium",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Net Premium" />
        ),
        cell: ({ row }) => <div>{row.original.net_premium}</div>,
        filterFn: "multiSelect",
        meta: {
          filterType: "multiselect",
          filterOptions: netPremiumFilterOptions,
          filterPlaceholder: "Filter by net premium...",
        } as ColumnMeta,
      },
      {
        accessorKey: "duration",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Duration" />
        ),
        cell: ({ row }) => (
          <div>{`${row.original.duration} ${row.original.duration_type}`}</div>
        ),
        filterFn: "multiSelect",
        meta: {
          filterType: "multiselect",
          filterOptions: durationFilterOptions,
          filterPlaceholder: "Filter by duration...",
        } as ColumnMeta,
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
        filterFn: "multiSelect",
        meta: {
          filterType: "multiselect",
          filterOptions: [
            { value: "active", label: "Active" },
            { value: "in_active", label: "Inactive" },
          ],
          filterPlaceholder: "Filter status...",
        } as ColumnMeta,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const record = row.original;
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
                  <DropdownMenuItem
                    onClick={() => setPremiumRangeProtectionId(record.id)}
                    asChild
                  >
                    <Link href={EDIT_ROUTE}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                )}
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
    [
      apiUserNameFilterOptions,
      setPremiumRangeProtectionId,
      rights,
      durationFilterOptions,
      netPremiumFilterOptions,
    ]
  );

  // ======== RENDER LOGIC ========
  const isLoading = premiumRangeProtectionListLoading;
  const isError = premiumRangeProtectionListIsError;
  const onError = premiumRangeProtectionListError?.message;

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
        title="Payment Modes List"
        addBtnTitle="Add Payment Mode"
        urlPath={ADD_ROUTE}
      />

      <PremiumRangeProtectionDatatable
        columns={columns}
        payload={premiumRangeProtectionList}
      />
    </>
  );
};

export default PremiumRangeProtectionList;
