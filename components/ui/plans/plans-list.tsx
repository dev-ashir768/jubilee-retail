"use client";

import usePlanIdStore from "@/hooks/usePlanIdStore";
import { getRights } from "@/utils/getRights";
import { redirect } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import SubNav from "../foundations/sub-nav";
import PlansDatatable from "./plans-datatable";
import { useQuery } from "@tanstack/react-query";
import { PlanPayloadTypes, PlanResponseTypes } from "@/types/planTypes";
import { fetchPlansList } from "@/helperFunctions/plansFunction";
import LoadingState from "../foundations/loading-state";
import Empty from "../foundations/empty";
import Error from "../foundations/error";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { ColumnMeta } from "@/types/dataTableTypes";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../shadcn/badge";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";
import { UserResponseType } from "@/types/usersTypes";
import { fetchAllUserList } from "@/helperFunctions/userFunction";

const PlansList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-plan";
  const EDIT_ROUTE = "/products-plans/edit-plan";
  const LISTING_ROUTE = "/products-plans/plan";
  const { setPlanId } = usePlanIdStore();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: planListData,
    isLoading: planListLoading,
    isError: planListIsError,
    error: planListError,
  } = useQuery<PlanResponseTypes | null>({
    queryKey: ["plans-list"],
    queryFn: fetchPlansList,
  });

  const {
    data: usersListResponse,
    isLoading: usersListLoading,
    isError: usersListIsError,
    error: usersListError,
  } = useQuery<UserResponseType | null>({
    queryKey: ["all-users-list"],
    queryFn: fetchAllUserList,
  });

  // ======== PAYLOADS DATA ========
  const planList = useMemo(() => planListData?.payload || [], [planListData]);

  const usersList = useMemo(
    () => usersListResponse?.payload || [],
    [usersListResponse]
  );

  const usersMap = useMemo(() => {
    const map: Record<number, string> = {};
    usersList.forEach((user) => {
      map[user.id] = user.fullname;
    });
    return map;
  }, [usersList]);

  // ======== FILTER OPTIONS ========
  const nameFilterOptions = useMemo(() => {
    if (!planList) return [];
    const uniqueName = Array.from(new Set(planList.map((plan) => plan.name)));
    return uniqueName.map((name) => ({
      label: name,
      value: name,
    }));
  }, [planList]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<PlanPayloadTypes>[] = [
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
        filterPlaceholder: "Filter by name...",
      } as ColumnMeta,
    },
    {
      id: "created_by",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Created by" />
      ),
      accessorFn: (row) => {
        return row?.created_by;
      },
      cell: ({ row }) => {
        const creatorId = row.original.created_by;
        const creatorName = usersMap[creatorId] ?? "N/A";
        return <div>{creatorName}</div>;
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
                <DropdownMenuItem onClick={() => setPlanId(record.id)} asChild>
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
  ];

  // ======== HANDLE ========
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_PLAN!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["plans-list"],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_PLAN!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["plans-list"],
          });
        },
      }
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading = planListLoading || usersListLoading;
  const isError = planListIsError || usersListIsError;
  const onError = planListError?.message || usersListError?.message;

  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights]);

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights && rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view list."
      />
    );

  return (
    <>
      <SubNav title="Plans List" addBtnTitle="Add Plan" urlPath={ADD_ROUTE} />

      <PlansDatatable columns={columns} payload={planList} />

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default PlansList;
