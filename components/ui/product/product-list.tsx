"use client";

import React, { useEffect, useMemo, useState } from "react";
import SubNav from "../foundations/sub-nav";
import ProductDatatable from "./product-datatable";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import { fetchAllUserList } from "@/helperFunctions/userFunction";
import { getRights } from "@/utils/getRights";
import useProductsIdStore from "@/hooks/useProductsIdStore";
import { useQuery } from "@tanstack/react-query";
import {
  ProductsPayloadTypes,
  ProductsResponseTypes,
} from "@/types/productsTypes";
import { UserResponseType } from "@/types/usersTypes";
import { fetchProductsList } from "@/helperFunctions/productsFunction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { ProductCategoriesResponseTypes } from "@/types/productCategoriesTypes";
import { fetchProductCategoriesList } from "@/helperFunctions/productCategoriesFunction";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useRouter } from "next/navigation";

const ProductList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-product";
  const EDIT_ROUTE = "/products-plans/edit-product";
  const LISTING_ROUTE = "/products-plans/product";
  const router = useRouter();
  const { setProductsId } = useProductsIdStore();
  const defaultDaysBack = 366;
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), defaultDaysBack),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: productListResponse,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: [
      "products-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchProductsList({
        startDate,
        endDate,
      }),
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

  const {
    data: productCategoriesListResponse,
    isLoading: productCategoriesListLoading,
    isError: productCategoriesListIsError,
    error: productCategoriesListError,
  } = useQuery<ProductCategoriesResponseTypes | null>({
    queryKey: ["product-categories-list"],
    queryFn: fetchProductCategoriesList,
  });
  // ======== PAYLOADS DATA ========
  const productList = useMemo(
    () => productListResponse?.payload || [],
    [productListResponse]
  );

  const usersList = useMemo(
    () => usersListResponse?.payload || [],
    [usersListResponse]
  );

  const productCategoriesList = useMemo(
    () => productCategoriesListResponse?.payload || [],
    [productCategoriesListResponse]
  );

  // ======== Lookups ========
  const userMap = useMemo(() => {
    if (!usersList || usersList.length === 0) return new Map();
    return new Map(usersList.map((users) => [users.id, users.fullname]));
  }, [usersList]);

  const productCategoryMap = useMemo(() => {
    if (!productCategoriesList || productCategoriesList.length === 0)
      return new Map();
    return new Map(productCategoriesList.map((item) => [item.id, item.name]));
  }, [productCategoriesList]);

  // ======== FILTER OPTIONS ========
  const productNameFilterOptions = useMemo(() => {
    if (!productList) return [];
    const uniqueName = Array.from(
      new Set(productList.map((item) => item.product_name))
    );
    return uniqueName.map((item) => ({
      label: item,
      value: item,
    }));
  }, [productList]);

  const productTypeFilterOptions = useMemo(() => {
    if (!productList) return [];
    const uniqueType = Array.from(
      new Set(productList.map((item) => item.product_type))
    );
    return uniqueType.map((item) => ({
      label: item,
      value: item,
    }));
  }, [productList]);

  const createdByFilterOptions = useMemo(() => {
    if (!productList.length || !userMap.size) return [];

    const creatorIdsInPlans = productList.map((item) => item.created_by);

    const uniqueCreatorIds = Array.from(new Set(creatorIdsInPlans));

    const options = uniqueCreatorIds
      .map((id) => {
        const name = userMap.get(id);
        return name ? { label: name, value: name } : null;
      })
      .filter(Boolean);

    return options as { label: string; value: string }[];
  }, [productList, userMap]);

  const productCategoryFilterOptions = useMemo(() => {
    if (!productList.length || !productCategoryMap.size) return [];
    const categoryIdsInProducts = new Set(
      productList.map((item) => item.product_category_id)
    );
    return Array.from(categoryIdsInProducts).reduce((options, id) => {
      const name = productCategoryMap.get(id);
      if (name) {
        options.push({ label: name, value: name });
      }
      return options;
    }, [] as { label: string; value: string }[]);
  }, [productList, productCategoryMap]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<ProductsPayloadTypes>[] = [
    {
      accessorKey: "product_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="product name" />
      ),
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: productNameFilterOptions,
        filterPlaceholder: "Filter by product name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "product_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="product type" />
      ),
      cell: ({ row }) => <div>{row.getValue("product_type")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: productTypeFilterOptions,
        filterPlaceholder: "Filter by product type...",
      } as ColumnMeta,
    },
    {
      id: "product_category_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="product category" />
      ),
      accessorFn: (row) => productCategoryMap.get(row.id) || row.id,
      cell: ({ row }) => <div>{row.getValue("product_category_id")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: productCategoryFilterOptions,
        filterPlaceholder: "Filter by product category...",
      } as ColumnMeta,
    },
    {
      id: "created_by",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Created by" />
      ),
      accessorFn: (row) => userMap.get(row.id) || row.id,
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit === "1" && (
                <DropdownMenuItem
                  onClick={() => setProductsId(record.id)}
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
  const isLoading =
    productListLoading || usersListLoading || productCategoriesListLoading;
  const isError =
    productListIsError || usersListIsError || productCategoriesListIsError;
  const onError =
    productListError?.message ||
    usersListError?.message ||
    productCategoriesListError?.message;

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

    if (!productList || productList.length === 0) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return <ProductDatatable columns={columns} payload={productList} />;
  };

  return (
    <>
      <SubNav
        title="Products List"
        addBtnTitle="Add Product"
        urlPath={ADD_ROUTE}
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
        defaultDaysBack={defaultDaysBack}
      />

      {renderPageContent()}
    </>
  );
};

export default ProductList;
