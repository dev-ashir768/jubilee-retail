"use client";

import {
  fetchAllDevelopmentOfficerList,
} from "@/helperFunctions/developmentOfficerFunction";
import {
  DevelopmentOfficerPayloadTypes,
  DevelopmentOfficerResponseTypes,
} from "@/types/developmentOfficerTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
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
import useDevelopmentOfficerIdStore from "@/hooks/useDevelopmentOfficerStore";
import DevelopmentOfficerDatatable from "./development-officer-datatable";
import LoadingState from "../foundations/loading-state";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";

const DevelopmentOfficersList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setDevelopmentOfficerId } = useDevelopmentOfficerIdStore();
  const queryClient = useQueryClient();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // Fetch development officer list data using react-query
  const {
    data: developmentOfficerListResponse,
    isLoading: developmentOfficerListLoading,
    isError: developmentOfficerListIsError,
    error: developmentOfficerListError,
  } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ["development-officers-list"],
    queryFn: fetchAllDevelopmentOfficerList,
  });

  // Column filter options
  const nameFilterOptions = useMemo(() => {
    const allNames =
      developmentOfficerListResponse?.payload?.map((item) => item.name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [developmentOfficerListResponse]);

  const igisCodeFilterOptions = useMemo(() => {
    const allIgisCodes =
      developmentOfficerListResponse?.payload?.map((item) => item.igis_code) ||
      [];
    const uniqueIgisCodes = Array.from(new Set(allIgisCodes));
    return uniqueIgisCodes.map((igis_code) => ({
      label: igis_code,
      value: igis_code,
    }));
  }, [developmentOfficerListResponse]);

  // const branchNameFilterOptions = useMemo(() => {
  //   const allBranchIds =
  //     developmentOfficerListResponse?.payload?.map((item) =>
  //       item.branch_id.toString()
  //     ) || [];
  //   const uniqueBranchIds = Array.from(new Set(allBranchIds));
  //   return uniqueBranchIds.map((branch_id) => ({
  //     label: branchNameMap.get(+branch_id),
  //     value: branchNameMap.get(+branch_id),
  //   }));
  // }, [developmentOfficerListResponse, branchNameMap]);

  // Define columns for the data table
  const columns: ColumnDef<DevelopmentOfficerPayloadTypes>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name") || "N/A"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "igis_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="IGIS Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("igis_code") || "N/A"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisCodeFilterOptions,
        filterPlaceholder: "Filter IGIS code...",
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
    // {
    //   accessorKey: "branch_id",
    //   header: ({ column }) => (
    //     <DatatableColumnHeader column={column} title="Branch Name" />
    //   ),
    //   accessorFn: (row) => branchNameMap.get(row.branch_id) || row.branch_id,
    //   cell: ({ row }) => <div>{row.getValue("branch_id")|| "N/A"}</div>,
    //   filterFn: "multiSelect",
    //   meta: {
    //     filterType: "multiselect",
    //     filterOptions: branchNameFilterOptions,
    //     filterPlaceholder: "Filter branch ID...",
    //   } as ColumnMeta,
    // },
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
                  onClick={() => setDevelopmentOfficerId(record.id)}
                  asChild
                >
                  <Link href="/agents-dos/edit-development-officers">
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
  ];

  // ======== HANDLE ========
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_DEVELOPMENTOFFICER!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["development-officers-list"],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_DEVELOPMENTOFFICER!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["development-officers-list"],
          });
        },
      }
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading = developmentOfficerListLoading;
  const isError = developmentOfficerListIsError;
  const onError = developmentOfficerListError?.message;

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

    if (
      !developmentOfficerListResponse?.payload ||
      developmentOfficerListResponse?.payload.length === 0
    ) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return (
      <DevelopmentOfficerDatatable
        columns={columns}
        payload={developmentOfficerListResponse?.payload || []}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Development Officer List"
        addBtnTitle="Add Development Officer"
        urlPath="/agents-dos/add-development-officers"
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

export default DevelopmentOfficersList;
