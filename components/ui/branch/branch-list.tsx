"use client";

import { fetchBranchList } from "@/helperFunctions/branchFunction";
import useBranchIdStore from "@/hooks/useBranchIdStore";
import { BranchPayloadType, BranchResponseType } from "@/types/branchTypes";
import { getRights } from "@/utils/getRights";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect, usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Error from "../foundations/error";
import { ColumnDef } from "@tanstack/react-table";
import Empty from "../foundations/empty";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "../shadcn/button";
import Link from "next/link";
import SubNav from "../foundations/sub-nav";
import BranchDatatable from "./branch-datatable";
import LoadingState from "../foundations/loading-state";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import DeleteDialog from "../common/delete-dialog";
import { getUserInfo } from "@/utils/getUserInfo";

const BranchList = () => {
  // Constants
  const ADD_URL = "/branches-clients/add-branch";
  const EDIT_URL = "/branches-clients/edit-branch";
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const userInfo = getUserInfo();
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();
  const { setBranchId } = useBranchIdStore();
  const pathname = usePathname();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";
  const defaultRange = {
    from: startOfMonth(new Date()),
    to: new Date(),
  };

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // Fetch branch list data using react-query
  const {
    data: branchListResponse,
    isLoading: branchListLoading,
    isError: branchListIsError,
    error: branchListError,
  } = useQuery<BranchResponseType | null>({
    queryKey: [
      "branch-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchBranchList({
        startDate,
        endDate,
      }),
  });

  // Column filter options
  const nameFilterOptions = useMemo(() => {
    const allName = branchListResponse?.payload?.map((item) => item.name) || [];
    const uniqueName = Array.from(new Set(allName));
    return uniqueName.map((name) => ({
      label: name,
      value: name,
    }));
  }, [branchListResponse]);

  const addressFilterOptions = useMemo(() => {
    const allAddress =
      branchListResponse?.payload?.map((item) => item.address) || [];
    const uniqueAddress = Array.from(new Set(allAddress));
    return uniqueAddress.map((address) => ({
      label: address,
      value: address,
    }));
  }, [branchListResponse]);

  const IGISBranchCodeFilterOptions = useMemo(() => {
    const allIGISBranchCode =
      branchListResponse?.payload?.map((item) => item.igis_branch_code) || [];
    const uniqueIGISBranchCode = Array.from(new Set(allIGISBranchCode));
    return uniqueIGISBranchCode.map((igis_branch_code) => ({
      label: igis_branch_code,
      value: igis_branch_code,
    }));
  }, [branchListResponse]);

  const IGISBranchTakafulCodeFilterOptions = useMemo(() => {
    const allIGISBranchTakafulCode =
      branchListResponse?.payload?.map(
        (item) => item.igis_branch_takaful_code,
      ) || [];
    const uniqueIGISBranchTakafulCode = Array.from(
      new Set(allIGISBranchTakafulCode),
    );
    return uniqueIGISBranchTakafulCode.map((igis_branch_takaful_code) => ({
      label: igis_branch_takaful_code,
      value: igis_branch_takaful_code,
    }));
  }, [branchListResponse]);

  const emailFilterOptions = useMemo(() => {
    const allEmail =
      branchListResponse?.payload?.map((item) => item.email) || [];
    const uniqueEmail = Array.from(new Set(allEmail));
    return uniqueEmail.map((email) => ({
      label: email,
      value: email,
    }));
  }, [branchListResponse]);

  const telephoneFilterOptions = useMemo(() => {
    const allTelephone =
      branchListResponse?.payload?.map((item) => item.telephone) || [];
    const uniqueTelephone = Array.from(new Set(allTelephone));
    return uniqueTelephone.map((telephone) => ({
      label: telephone,
      value: telephone,
    }));
  }, [branchListResponse]);

  const hisCodeFilterOptions = useMemo(() => {
    const allHisCode =
      branchListResponse?.payload?.map((item) => item.his_code) || [];
    const UniqueHisCode = Array.from(new Set(allHisCode));
    return UniqueHisCode.map((his_code) => ({
      label: his_code,
      value: his_code,
    }));
  }, [branchListResponse]);

  const hisCodeTakafulFilterOptions = useMemo(() => {
    const allHisCodeTakaful =
      branchListResponse?.payload?.map((item) => item.his_code_takaful) || [];
    const UniqueHisCodeTakaful = Array.from(new Set(allHisCodeTakaful));
    return UniqueHisCodeTakaful.map((his_code_takaful) => ({
      label: his_code_takaful,
      value: his_code_takaful,
    }));
  }, [branchListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<BranchPayloadType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => <div>{row.getValue("address")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: addressFilterOptions,
        filterPlaceholder: "Filter address...",
      },
    },
    {
      accessorKey: "igis_branch_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="IGIS Branch Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("igis_branch_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: IGISBranchCodeFilterOptions,
        filterPlaceholder: "Filter igis_branch_code...",
      },
    },
    {
      accessorKey: "igis_branch_takaful_code",
      header: ({ column }) => (
        <DatatableColumnHeader
          column={column}
          title="IGIS Branch Takaful Code"
        />
      ),
      cell: ({ row }) => <div>{row.getValue("igis_branch_takaful_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: IGISBranchTakafulCodeFilterOptions,
        filterPlaceholder: "Filter igis_branch_takaful_code...",
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: emailFilterOptions,
        filterPlaceholder: "Filter email...",
      },
    },
    {
      accessorKey: "telephone",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Telephone" />
      ),
      cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: telephoneFilterOptions,
        filterPlaceholder: "Filter telephone...",
      },
    },
    {
      accessorKey: "his_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="His Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("his_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: hisCodeFilterOptions,
        filterPlaceholder: "Filter his_code...",
      },
    },
    {
      accessorKey: "his_code_takaful",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="His Code Takaful" />
      ),
      cell: ({ row }) => <div>{row.getValue("his_code_takaful")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: hisCodeTakafulFilterOptions,
        filterPlaceholder: "Filter his_code_takaful...",
      },
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as string;
        const id = row.original.id;
        return (
          <Badge
            className={`justify-center py-1 min-w-[50px] w-[70px]`}
            variant={status === "active" ? "success" : "danger"}
            onClick={statusIsPending ? undefined : () => handleStatusUpdate(id)}
          >
            {status}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit === "1" && (
                <DropdownMenuItem
                  onClick={() => setBranchId(record.id)}
                  asChild
                >
                  <Link href={EDIT_URL}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {rights?.can_delete === "1" && (
                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ======== HANDLE ========
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_BRANCH!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "branch-list",
              ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
            ],
          });
          setSelectedRecordId(null);
        },
      },
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_BRANCH!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "branch-list",
              ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
            ],
          });
        },
      },
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading = branchListLoading;
  const isError = branchListIsError;
  const onError = branchListError?.message;

  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect(userInfo?.redirection_url ? userInfo.redirection_url : "/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, userInfo]);

  if ((rights && rights?.can_view === "0") || !rights?.can_view)
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

    if (
      !branchListResponse?.payload ||
      branchListResponse.payload.length === 0
    ) {
      return <Empty title="Not Found" description="No Branches Found" />;
    }

    return (
      <BranchDatatable
        columns={columns}
        payload={branchListResponse?.payload || []}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Branch List"
        addBtnTitle="Add Branch"
        urlPath={ADD_URL}
        datePicker={true}
        dateRange={dateRange}
        defaultDate={defaultRange}
        setDateRange={setDateRange}
      />

      {renderPageContent()}

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default BranchList;
