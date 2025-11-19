"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import ProductPlansDatatable from "./product-plans-datatable";
import {
  ProductPlansPayloadTypes,
  ProductPlansResponseTypes,
} from "@/types/productPlansTypes";
import { useQuery } from "@tanstack/react-query";
import { fetchProductPlansList } from "@/helperFunctions/productPlansFunctions";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import { Badge } from "../shadcn/badge";

const ProductPlansList = () => {
  // ======== DATA FETCHING ========
  const {
    data: productPlansListResponse,
    isLoading: productPlansListLoading,
    isError: productPlansListIsError,
    error: productPlansListError,
  } = useQuery<ProductPlansResponseTypes | null>({
    queryKey: ["product-plans-list"],
    queryFn: fetchProductPlansList,
  });

  // ======== PAYLOADS DATA ========
  const productPlansList = useMemo(
    () => productPlansListResponse?.payload || [],
    [productPlansListResponse]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<ProductPlansPayloadTypes>[] = [
    {
      accessorKey: "api_user_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="API User ID" />
      ),
      cell: ({ row }) => <div>{row.original.api_user_id}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
      accessorKey: "products_count",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Products Count" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.products.length}</Badge>
      ),
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Product Name" />
      ),
      accessorFn: (row) => row.products[0]?.product_name,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.products[0]?.product_name || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "product_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Product Type" />
      ),
      accessorFn: (row) => row.products[0]?.product_type,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.products[0]?.product_type || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "parent_sku",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Parent SKU" />
      ),
      accessorFn: (row) => row.products[0]?.parent_sku,
      cell: ({ row }) => (
        <div>{row.original.products[0]?.parent_sku || "N/A"}</div>
      ),
    },
    {
      accessorKey: "child_sku",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Child SKU" />
      ),
      accessorFn: (row) => row.products[0]?.child_sku,
      cell: ({ row }) => (
        <div>{row.original.products[0]?.child_sku || "N/A"}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => <div>{row.original.phone}</div>,
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.is_active === 1;
        return (
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => (
        <div>{new Date(row.original.created_at).toLocaleDateString()}</div>
      ),
    },
  ];

  // ======== RENDER LOGIC ========
  const isLoading = productPlansListLoading;
  const isError = productPlansListIsError;
  const onError = productPlansListError?.message;

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  const isDataEmpty = productPlansList.length === 0;

  return (
    <>
      <SubNav title="Product Plans List" />

      {isDataEmpty ? (
        <Empty
          title="No Product Plans Found"
          description="It looks like no API User Product Plans have been created yet."
        />
      ) : (
        <ProductPlansDatatable columns={columns} payload={productPlansList} />
      )}
    </>
  );
};

export default ProductPlansList;
