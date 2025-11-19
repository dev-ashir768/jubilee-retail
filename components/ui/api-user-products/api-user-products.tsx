"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { fetchApiUserProductsList } from "@/helperFunctions/apiUserProductsFunction";
import {
  ApiUserProductsPayloadType,
  ApiUserProductsResponseType,
} from "@/types/apiUserProductsTypes";
import ApiUserProductsDatatable from "./api-user-products-datatable";
import { createFilterOptions } from "@/utils/filterOptions";
import { fetchAllApiUserList } from "@/helperFunctions/userFunction";
import { ApiUsersResponseType } from "@/types/usersTypes";
import ApiUserProductsFilters from "../filters/api-user-products";
import { apiUserProductsFilterState } from "@/hooks/apiUserProductsFilterState";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";

const ApiUserProductsList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/users/add-api-user-products";
  const EDIT_ROUTE = "/users/edit-api-user-products";
  const LISTING_ROUTE = "/users/api-user-products";
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filterValue } = apiUserProductsFilterState();
  const { setApiUserProductsId } = useApiUserProductsIdStore();
  const router = useRouter();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();
  const queryClient = useQueryClient();

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
    queryKey: ["api-user-products-list", ...(filterValue ? [filterValue] : [])],
    queryFn: () =>
      fetchApiUserProductsList({
        api_user_id: filterValue!,
      }),
  });

  const {
    data: apiUserResponse,
    isLoading: apiUserLoading,
    isError: apiUserIsError,
    error: apiUserError,
  } = useQuery<ApiUsersResponseType | null>({
    queryKey: ["all-api-user-list"],
    queryFn: fetchAllApiUserList,
  });

  // ======== PAYLOADS DATA ========
  const apiUserProductsList = useMemo(
    () => apiUserProductsListData?.payload || [],
    [apiUserProductsListData]
  );

  const apiUserList = useMemo(
    () => apiUserResponse?.payload || [],
    [apiUserResponse]
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
      accessorKey: "api_user_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Api User" />
      ),
      cell: ({ row }) => {
        const apiUser = apiUserList.find(
          (item) => item.id === row.getValue("api_user_id")
        );
        return (
          <div>{apiUser ? apiUser.name : row.getValue("api_user_id")}</div>
        );
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
        module: process.env.NEXT_PUBLIC_PATH_APIUSERPRODUCT!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "api-user-products-list",
              ...(filterValue ? [filterValue] : []),
            ],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_APIUSERPRODUCT!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "api-user-products-list",
              ...(filterValue ? [filterValue] : []),
            ],
          });
        },
      }
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading = apiUserProductsListLoading || apiUserLoading;
  const isError = apiUserProductsListIsError || apiUserIsError;
  const onError = apiUserProductsListError?.message || apiUserError?.message;

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

    return (
      <ApiUserProductsDatatable
        columns={columns}
        payload={apiUserProductsList}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Api User Products List"
        addBtnTitle="Add User Product"
        urlPath={ADD_ROUTE}
        filter={true}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {renderPageContent()}

      <ApiUserProductsFilters
        apiUserList={apiUserList}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default ApiUserProductsList;
