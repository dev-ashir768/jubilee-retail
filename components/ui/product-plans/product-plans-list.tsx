"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import ProductPlansDatatable from "./product-plans-datatable";
import {
  ProductPlansResponseTypes,
  ProductsTypes,
} from "@/types/productPlansTypes";
import { useQuery } from "@tanstack/react-query";
import { fetchProductPlansList } from "@/helperFunctions/productPlansFunctions";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";

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

  const productPlansData = productPlansList[0]?.products || []

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<ProductsTypes>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Product Name" />
      ),
      accessorFn: (row) => row?.product_name,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original?.product_name || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "parent_sku",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Parent SKU" />
      ),
      accessorFn: (row) => row?.parent_sku,
      cell: ({ row }) => (
        <div>{row.original?.parent_sku || "N/A"}</div>
      ),
    },
    {
      accessorKey: "child_sku",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Child SKU" />
      ),
      accessorFn: (row) => row?.child_sku,
      cell: ({ row }) => (
        <div>{row.original?.child_sku || "N/A"}</div>
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
        <ProductPlansDatatable columns={columns} payload={productPlansData} />
      )}
    </>
  );
};

export default ProductPlansList;
