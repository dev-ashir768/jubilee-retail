"use client";

import { fetchPlansList } from "@/helperFunctions/plansFunction";
import { fetchProductOptionsList } from "@/helperFunctions/productOptionsFunction";
import { fetchProductsList } from "@/helperFunctions/productsFunction";
import {
  fetchAllUserList,
} from "@/helperFunctions/userFunction";
import { fetchWebAppMappersList } from "@/helperFunctions/webAppMappersFunction";
import useWebAppMappersIdStore from "@/hooks/webAppMappersIdStore";
import { PlanResponseTypes } from "@/types/planTypes";
import { ProductOptionsResponseTypes } from "@/types/productOptionsTypes";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { UserResponseType } from "@/types/usersTypes";
import {
  WebAppMappersPayloadTypes,
  WebAppMappersResponseTypes,
} from "@/types/webAppMappersTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import SubNav from "../foundations/sub-nav";
import WebAppMappersDatatable from "./web-app-mappers-datatable";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";

const WebAppMappersList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_URL = "/mapping/add-web-app-mapper";
  const EDIT_URL = "/mapping/edit-web-app-mapper";
  const pathname = usePathname();
  const { setWebAppMapperId } = useWebAppMappersIdStore();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // ======== DATA FETCHING ========
  const {
    data: webAppMappersListResponse,
    isLoading: webAppMappersListLoading,
    isError: webAppMappersListIsError,
    error: webAppMappersListError,
  } = useQuery<WebAppMappersResponseTypes | null>({
    queryKey: ["web-app-mappers-list"],
    queryFn: fetchWebAppMappersList,
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

  const { data: plansListResponse } = useQuery<PlanResponseTypes | null>({
    queryKey: ["plans-list"],
    queryFn: fetchPlansList,
  });

  const { data: productListResponse } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["products-list"],
    queryFn: fetchProductsList,
  });

  const { data: productOptionsListResponse } =
    useQuery<ProductOptionsResponseTypes | null>({
      queryKey: ["product-options-list"],
      queryFn: fetchProductOptionsList,
    });

  // ======== PAYLOADS DATA ========
  const webAppMappersList = useMemo(
    () => webAppMappersListResponse?.payload || [],
    [webAppMappersListResponse]
  );

  const usersList = useMemo(
    () => usersListResponse?.payload || [],
    [usersListResponse]
  );

  const plansList = useMemo(
    () => plansListResponse?.payload || [],
    [plansListResponse]
  );

  const productList = useMemo(
    () => productListResponse?.payload || [],
    [productListResponse]
  );

  const productOptionsList = useMemo(
    () => productOptionsListResponse?.payload || [],
    [productOptionsListResponse]
  );

  // ======== LOOKUP MAPS ========
  const userMap = useMemo(
    () => new Map(usersList.map((user) => [user.id, user.fullname])),
    [usersList]
  );
  const planMap = useMemo(
    () => new Map(plansList.map((plan) => [plan.id, plan.name])),
    [plansList]
  );
  const productMap = useMemo(
    () =>
      new Map(productList.map((product) => [product.id, product.product_name])),
    [productList]
  );
  const optionMap = useMemo(
    () =>
      new Map(
        productOptionsList.map((option) => [option.id, option.option_name])
      ),
    [productOptionsList]
  );

  // ======== FILTER OPTIONS ========
  const useCreateFilterOptions = (
    list: WebAppMappersPayloadTypes[], // 1. Accept the list as an argument
    key: keyof WebAppMappersPayloadTypes
  ) =>
    useMemo(() => {
      if (!list || list.length === 0) return []; // 2. Use the argument here
      const uniqueValues = Array.from(new Set(list.map((item) => item[key])));
      return uniqueValues.map((value) => ({
        label: String(value),
        value: String(value),
      }));
    }, [list, key]); // 3. And in the dependency array

  const parentSkuFilterOptions = useCreateFilterOptions(
    webAppMappersList,
    "parent_sku"
  );
  const childSkuFilterOptions = useCreateFilterOptions(
    webAppMappersList,
    "child_sku"
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<WebAppMappersPayloadTypes>[] = [
    {
      accessorKey: "parent_sku",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Parent SKU" />
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: parentSkuFilterOptions,
        filterPlaceholder: "Filter...",
      } as ColumnMeta,
    },
    {
      accessorKey: "child_sku",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Child SKU" />
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: childSkuFilterOptions,
        filterPlaceholder: "Filter...",
      } as ColumnMeta,
    },
    {
      id: "plan_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Plan" />
      ),
      accessorFn: (row) => planMap.get(row.plan_id) || "Unknown Plan",
    },
    {
      id: "product_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Product" />
      ),
      accessorFn: (row) => productMap.get(row.product_id) || "Unknown Product",
    },
    {
      id: "option_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Option" />
      ),
      accessorFn: (row) => optionMap.get(row.option_id) || "Unknown Option",
    },
    {
      id: "created_by",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Created by" />
      ),
      accessorFn: (row) => userMap.get(row.created_by) || "Unknown User",
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
                  onClick={() => setWebAppMapperId(record.id)}
                  asChild
                >
                  <Link href={EDIT_URL}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {rights?.can_delete === "1" && (
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
  const isLoading = webAppMappersListLoading || usersListLoading;
  const isError = usersListIsError || webAppMappersListIsError;
  const onError = usersListError?.message || webAppMappersListError?.message;

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav
        title="Web App Mappers List"
        addBtnTitle="Add Mapper"
        urlPath={ADD_URL}
      />
      <WebAppMappersDatatable columns={columns} payload={webAppMappersList} />
    </>
  );
};

export default WebAppMappersList;
