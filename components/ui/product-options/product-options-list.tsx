"use client";

import { fetchProductOptionsList } from "@/helperFunctions/productOptionsFunction";
import { fetchAllProductsList } from "@/helperFunctions/productsFunction";
import useProductOptionsIdStore from "@/hooks/useProductOptionsIdStore";
import {
  ProductOptionsPayloadTypes,
  ProductOptionsResponseTypes,
} from "@/types/productOptionsTypes";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
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
import { Badge } from "../shadcn/badge";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import SubNav from "../foundations/sub-nav";
import ProductOptionsDatatable from "./product-options-datatable";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";
import { formatNumberCell } from "@/utils/numberFormaterFunction";

const ProductOptionsList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-product-options";
  const EDIT_ROUTE = "/products-plans/edit-product-options";
  const LISTING_ROUTE = "/products-plans/product-options";
  const { setProductOptionsId } = useProductOptionsIdStore();
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
    data: productOptionsListResponse,
    isLoading: productOptionsListLoading,
    isError: productOptionsListIsError,
    error: productOptionsListError,
  } = useQuery<ProductOptionsResponseTypes | null>({
    queryKey: ["product-options-list"],
    queryFn: fetchProductOptionsList,
  });

  const {
    data: productListResponse,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["all-products-list"],
    queryFn: fetchAllProductsList,
  });

  // ======== PAYLOADS DATA ========
  const productOptionsList = useMemo(
    () => productOptionsListResponse?.payload || [],
    [productOptionsListResponse]
  );
  const productList = useMemo(
    () => productListResponse?.payload || [],
    [productListResponse]
  );

  // ======== LOOKUP MAPS ========
  const productMap = useMemo(() => {
    if (!productList.length) return new Map();
    return new Map(
      productList.map((product) => [product.id, product.product_name])
    );
  }, [productList]);

  // ======== FILTER OPTIONS ========
  const productNameFilterOptions = useMemo(() => {
    if (!productOptionsList.length || !productMap.size) return [];
    const productIdsInOptions = new Set(
      productOptionsList.map((item) => item.product_id)
    );
    return Array.from(productIdsInOptions).reduce((options, id) => {
      const name = productMap.get(id);
      if (name) {
        options.push({ label: name, value: name });
      }
      return options;
    }, [] as { label: string; value: string }[]);
  }, [productOptionsList, productMap]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<ProductOptionsPayloadTypes>[] = [
    {
      id: "product_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Product" />
      ),
      accessorFn: (row) => productMap.get(row.product_id) || "Unknown Product",
      cell: ({ row }) => <div>{row.getValue("product_id")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: productNameFilterOptions,
        filterPlaceholder: "Filter by product...",
      } as ColumnMeta,
    },
    {
      accessorKey: "option_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Option Name" />
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Price" />
      ),
      accessorFn: (row) => row.price || "N/A",
      cell: ({ row }) => <div>{formatNumberCell(row.getValue("price"))}</div>,
    },
    {
      id: "duration",
      header: "Duration",
      accessorFn: (row) => `${row.duration} ${row.duration_type || ""}`.trim(),
    },
    {
      accessorKey: "gross_premium",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Gross Premium" />
      ),
      accessorFn: (row) => row.gross_premium || "N/A",
      cell: ({ row }) => (
        <div>{formatNumberCell(row.getValue("gross_premium"))}</div>
      ),
    },
    {
      accessorKey: "start_limit",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Start Limit" />
      ),
      accessorFn: (row) => row.start_limit || "N/A",
      cell: ({ row }) => (
        <div>{formatNumberCell(row.getValue("start_limit"))}</div>
      ),
    },
    {
      accessorKey: "end_limit",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="End Limit" />
      ),
    },
    {
      accessorKey: "stamp_duty",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Stamp Duty" />
      ),
    },
    {
      accessorKey: "sales_tax",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Sales Tax" />
      ),
    },
    {
      accessorKey: "federal_insurance_fee",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Fed. Insurance Fee" />
      ),
    },
    {
      accessorKey: "subtotal",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Subtotal" />
      ),
      accessorFn: (row) => row.subtotal || "N/A",
      cell: ({ row }) => (
        <div>{formatNumberCell(row.getValue("subtotal"))}</div>
      ),
    },
    {
      accessorKey: "plan_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Plan Code" />
      ),
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
          { value: "inactive", label: "Inactive" },
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
                  onClick={() => setProductOptionsId(record.id)}
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
        module: process.env.NEXT_PUBLIC_PATH_PRODUCTOPTION!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-options-list"],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_PRODUCTOPTION!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-options-list"],
          });
        },
      }
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading =
    productOptionsListLoading || productListLoading;
  const isError =
    productOptionsListIsError || productListIsError;
  const onError =
    productOptionsListError?.message ||
    productListError?.message;

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view plans list."
      />
    );

  return (
    <>
      <SubNav
        title="Product Options List"
        addBtnTitle="Add Product Option"
        urlPath={ADD_ROUTE}
      />

      <ProductOptionsDatatable columns={columns} payload={productOptionsList} />

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default ProductOptionsList;
