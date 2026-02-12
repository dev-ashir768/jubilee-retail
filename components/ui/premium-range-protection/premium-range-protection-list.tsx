"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import SubNav from "../foundations/sub-nav";
import { redirect } from "next/navigation";
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
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";
import { formatNumberCell } from "@/utils/numberFormaterFunction";
import { getUserInfo } from "@/utils/getUserInfo";

const PremiumRangeProtectionList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-premium-range-protection";
  const EDIT_ROUTE = "/products-plans/edit-premium-range-protection";
  const LISTING_ROUTE = "/products-plans/premium-range-protection";
  const { setPremiumRangeProtectionId } = usePremiumRangeProtectionIdStore();
  const queryClient = useQueryClient();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();
  const userInfo = getUserInfo();

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
    [premiumRangeProtectionListResponse],
  );

  // ======== FILTER OPTIONS ========
  const apiUserNameFilterOptions = useMemo(
    () => createFilterOptions(premiumRangeProtectionList, "apiUser.name"),
    [premiumRangeProtectionList],
  );

  const netPremiumFilterOptions = useMemo(
    () => createFilterOptions(premiumRangeProtectionList, "net_premium"),
    [premiumRangeProtectionList],
  );

  const durationFilterOptions = useMemo(
    () => createFilterOptions(premiumRangeProtectionList, "duration"),
    [premiumRangeProtectionList],
  );

  // ======== HANDLE ========
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_PREMIUMRANGEPROTECTION!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["premium-range-protection-list"],
          });
          setSelectedRecordId(null);
        },
      },
    );
  };

  const handleStatusUpdate = useCallback(
    (id: number) => {
      return statusMutate(
        {
          module: process.env.NEXT_PUBLIC_PATH_PREMIUMRANGEPROTECTION!,
          record_id: id,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["premium-range-protection-list"],
            });
          },
        },
      );
    },
    [statusMutate, queryClient],
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
          <div>{`${formatNumberCell(row.original.premium_start)} - ${formatNumberCell(row.original.premium_end)}`}</div>
        ),
      },
      {
        accessorKey: "net_premium",
        header: ({ column }) => (
          <DatatableColumnHeader column={column} title="Net Premium" />
        ),
        cell: ({ row }) => (
          <div>{formatNumberCell(row.original.net_premium)}</div>
        ),
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
          const id = row.original?.id;
          return (
            <Badge
              className={`justify-center py-1 min-w-[50px] w-[70px]`}
              variant={status === "active" ? "success" : "danger"}
              onClick={
                statusIsPending ? undefined : () => handleStatusUpdate(id)
              }
            >
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
                {rights?.can_delete === "1" && (
                  <DropdownMenuItem
                    onClick={() => {
                      setDeleteDialogOpen(true);
                      setSelectedRecordId(record.id);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-1" />
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
      handleStatusUpdate,
      statusIsPending,
    ],
  );

  // ======== RENDER LOGIC ========
  const isLoading = premiumRangeProtectionListLoading;
  const isError = premiumRangeProtectionListIsError;
  const onError = premiumRangeProtectionListError?.message;

  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect(userInfo?.redirection_url ? userInfo.redirection_url : "/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, userInfo]);

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
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
        title="Payment Modes List"
        addBtnTitle="Add Payment Mode"
        urlPath={ADD_ROUTE}
      />

      <PremiumRangeProtectionDatatable
        columns={columns}
        payload={premiumRangeProtectionList}
      />

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default PremiumRangeProtectionList;
