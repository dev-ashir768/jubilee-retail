"use client";

import { fetchProductCategoriesList } from "@/helperFunctions/productCategoriesFunction";
import useProductCategoryIdStore from "@/hooks/useProductCategoryStore";
import {
  ProductCategoriesPayloadTypes,
  ProductCategoriesResponseTypes,
} from "@/types/productCategoriesTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import SubNav from "../foundations/sub-nav";
import ProductCategoryDatatable from "./product-category-datatable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { ColumnMeta } from "@/types/dataTableTypes";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { fetchAllUserList } from "@/helperFunctions/userFunction";
import { UserResponseType } from "@/types/usersTypes";
import { Badge } from "../shadcn/badge";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";

const ProductCategoryList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-product-category";
  const EDIT_ROUTE = "/products-plans/edit-product-category";
  const LISTING_ROUTE = "/products-plans/product-category";
  const { setProductCategoryId } = useProductCategoryIdStore();

  const queryClient = useQueryClient();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: productCategoriesListResponse,
    isLoading: productCategoriesListLoading,
    isError: productCategoriesListIsError,
    error: productCategoriesListError,
  } = useQuery<ProductCategoriesResponseTypes | null>({
    queryKey: ["product-categories-list"],
    queryFn: fetchProductCategoriesList,
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
  const productCategoriesList = useMemo(
    () => productCategoriesListResponse?.payload || [],
    [productCategoriesListResponse]
  );

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
    if (!productCategoriesList) return [];
    const uniqueName = Array.from(
      new Set(productCategoriesList.map((item) => item.name))
    );
    return uniqueName.map((name) => ({
      label: name,
      value: name,
    }));
  }, [productCategoriesList]);

  const igisProductCodeFilterOptions = useMemo(() => {
    if (!productCategoriesList) return [];
    const uniqueIgisProductCode = Array.from(
      new Set(productCategoriesList.map((item) => item.igis_product_code))
    );
    return uniqueIgisProductCode.map((item) => ({
      label: item,
      value: item,
    }));
  }, [productCategoriesList]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<ProductCategoriesPayloadTypes>[] = [
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
      accessorKey: "igis_product_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Igis Product Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("igis_product_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisProductCodeFilterOptions,
        filterPlaceholder: "Filter by igis product code...",
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit === "1" && (
                <DropdownMenuItem
                  onClick={() => setProductCategoryId(record.id)}
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
        module: process.env.NEXT_PUBLIC_PATH_PRODUCTCATEGORY!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-categories-list"],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_PRODUCTCATEGORY!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-categories-list"],
          });
        },
      }
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading = productCategoriesListLoading || usersListLoading;
  const isError = productCategoriesListIsError || usersListIsError;
  const onError =
    productCategoriesListError?.message || usersListError?.message;

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view product category list."
      />
    );

  return (
    <>
      <SubNav
        title="Product Category List"
        addBtnTitle="Add Category"
        urlPath={ADD_ROUTE}
      />

      <ProductCategoryDatatable
        columns={columns}
        payload={productCategoriesList}
      />

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default ProductCategoryList;
