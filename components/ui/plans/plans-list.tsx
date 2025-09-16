"use client";

import usePlanIdStore from "@/hooks/usePlanIdStore";
import { getRights } from "@/utils/getRights";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
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
import { UserResponseType } from "@/types/usersTypes";
import { fetchUserList } from "@/helperFunctions/userFunction";

const PlansList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-plan";
  const EDIT_ROUTE = "/products-plans/edit-plan";
  const LISTING_ROUTE = "/products-plans/plan";
  const { setPlanId } = usePlanIdStore();
  const router = useRouter();

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
    data: usersListData,
    isLoading: usersListLoading,
    isError: usersListIsError,
    error: usersListError,
  } = useQuery<UserResponseType | null>({
    queryKey: ["users-list"],
    queryFn: fetchUserList,
  });

  // ======== PAYLOADS DATA ========
  const planList = useMemo(() => planListData?.payload || [], [planListData]);
  const usersList = useMemo(
    () => usersListData?.payload || [],
    [usersListData]
  );

  // ======== LOOKUPS ========
  const userMap = useMemo(() => {
    if (!usersList || usersList.length === 0) return new Map();
    return new Map(usersList.map((users) => [users.id, users.fullname]));
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

  const createdByFilterOptions = useMemo(() => {
    if (!planList.length || !userMap.size) return [];

    const creatorIdsInPlans = planList.map((plan) => plan.created_by);

    const uniqueCreatorIds = Array.from(new Set(creatorIdsInPlans));

    const options = uniqueCreatorIds
      .map((id) => {
        const name = userMap.get(id);
        return name ? { label: name, value: name } : null;
      })
      .filter(Boolean);

    return options as { label: string; value: string }[];
  }, [planList, userMap]);

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
      accessorFn: (row) => userMap.get(row.created_by) || row.created_by,
      cell: ({ row }) => <div>{row.getValue("created_by")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: createdByFilterOptions,
        filterPlaceholder: "Filter by creator...",
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
                <DropdownMenuItem onClick={() => setPlanId(record.id)} asChild>
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
  ];

  // ======== RENDER LOGIC ========
  const isLoading = planListLoading || usersListLoading;
  const isError = planListIsError || usersListIsError;
  const onError = planListError?.message || usersListError?.message;

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
        description="You do not have permission to view plans list."
      />
    );

  return (
    <>
      <SubNav title="Plans List" addBtnTitle="Add Plan" urlPath={ADD_ROUTE} />

      <PlansDatatable columns={columns} payload={planList} />
    </>
  );
};

export default PlansList;
