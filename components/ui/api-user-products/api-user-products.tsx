"use client";

import React, { useEffect, useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import { useQuery } from "@tanstack/react-query";
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
import { Badge } from "../shadcn/badge";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import useApiUserProductsIdStore from "@/hooks/apiUserProductsIdStore";
import {
  createFilterOptions,
  fetchApiUserProductsList,
} from "@/helperFunctions/apiUserProductsFunction";
import {
  ApiUserProductsPayloadType,
  ApiUserProductsResponseType,
} from "@/types/apiUserProductsTypes";
import ApiUserProductsDatatable from "./api-user-products-datatable";

const ApiUserProductsList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/users/add-api-user-products";
  const EDIT_ROUTE = "/users/edit-api-user-products";
  const LISTING_ROUTE = "/users/api-user-products";
  const { setApiUserProductsId } = useApiUserProductsIdStore();
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: apiUserProductsListData,
    isLoading: apiUserProductsListLoading,
    isError: apiUserProductsListIsError,
    error: apiUserProductsListError,
  } = useQuery<ApiUserProductsResponseType | null>({
    queryKey: ["api-user-products-list"],
    queryFn: fetchApiUserProductsList,
  });

  // ======== PAYLOADS DATA ========
  const apiUserProductsList = useMemo(
    () => apiUserProductsListData?.payload || [],
    [apiUserProductsListData]
  );

  // ======== FILTER OPTIONS ========
  const nameFilterOptions = useMemo(
    () => createFilterOptions(apiUserProductsList, "name"),
    [apiUserProductsList]
  );

  const emailFilterOptions = useMemo(
    () => createFilterOptions(apiUserProductsList, "email"),
    [apiUserProductsList]
  );

  const phoneFilterOptions = useMemo(
    () => createFilterOptions(apiUserProductsList, "phone"),
    [apiUserProductsList]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<ApiUserProductsPayloadType>[] = [
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
      accessorKey: "email",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: emailFilterOptions,
        filterPlaceholder: "Filter by email...",
      } as ColumnMeta,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: phoneFilterOptions,
        filterPlaceholder: "Filter by phone...",
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
                  onClick={() => setApiUserProductsId(record.id)}
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
  ];

  // ======== RENDER LOGIC ========
  const isLoading = apiUserProductsListLoading;
  const isError = apiUserProductsListIsError;
  const onError = apiUserProductsListError?.message;

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
        title="Api User Products List"
        addBtnTitle="Add User Product"
        urlPath={ADD_ROUTE}
      />

      <ApiUserProductsDatatable
        columns={columns}
        payload={apiUserProductsList}
      />
    </>
  );
};

export default ApiUserProductsList;
