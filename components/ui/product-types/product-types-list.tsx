"use client";

import { fetchProductTypesList } from '@/helperFunctions/productTypesFunction';
import { fetchAllUserList } from '@/helperFunctions/userFunction';
import useProductTypesIdStore from '@/hooks/useProductTypesIdStore';
import { ProductTypePayloadTypes, ProductTypeResponseTypes } from '@/types/productTypeTypes';
import { UserResponseType } from '@/types/usersTypes';
import { getRights } from '@/utils/getRights';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { ColumnMeta } from '@/types/dataTableTypes';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../shadcn/badge';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnDef } from '@tanstack/react-table';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import SubNav from '../foundations/sub-nav';
import ProductTypesDatatable from './product-types-datatable';

const ProductTypesList = () => {

  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = '/products-plans/add-product-type'
  const EDIT_ROUTE = '/products-plans/edit-product-type'
  const LISTING_ROUTE = '/products-plans/product-type'
  const { setProductTypeId } = useProductTypesIdStore();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])

  // ======== DATA FETCHING ========
  const { data: productTypesListResponse, isLoading: productTypesListLoading, isError: productTypesListIsError, error: productTypesListError } = useQuery<ProductTypeResponseTypes | null>({
    queryKey: ['product-types-list'],
    queryFn: fetchProductTypesList
  })

  const { data: usersListResponse, isLoading: usersListLoading, isError: usersListIsError, error: usersListError } = useQuery<UserResponseType | null>({
  queryKey: ['all-users-list'],
      queryFn: fetchAllUserList
  })

  // ======== PAYLOADS DATA ========
  const productTypesList = useMemo(() => productTypesListResponse?.payload || [], [productTypesListResponse]);

  const usersList = useMemo(() => usersListResponse?.payload || [], [usersListResponse]);

  // ======== LOOKUP MAPS ========
  const userMap = useMemo(() => {
    if (!usersList.length) return new Map();
    return new Map(usersList.map((user) => [user.id, user.fullname]));
  }, [usersList]);

  // ======== FILTER OPTIONS ========
  const useCreateFilterOptions = (
    list: ProductTypePayloadTypes[],
    key: keyof ProductTypePayloadTypes
  ) => {
    return useMemo(() => {
      if (!list || !list.length) return [];
      const uniqueValues = Array.from(new Set(list.map(item => item[key])));
      return uniqueValues.map(value => ({
        label: String(value),
        value: String(value),
      }));
    }, [list, key]);
  };

  const nameFilterOptions = useCreateFilterOptions(productTypesList, 'name');
  const daysFilterOptions = useCreateFilterOptions(productTypesList, 'days');

  const createdByFilterOptions = useMemo(() => {
    if (!productTypesList.length || !userMap.size) return [];
    const creatorIdsInList = new Set(productTypesList.map(item => item.created_by));
    return Array.from(creatorIdsInList).reduce((options, id) => {
      const name = userMap.get(id);
      if (name) {
        options.push({ label: name, value: name });
      }
      return options;
    }, [] as { label: string, value: string }[]);
  }, [productTypesList, userMap]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<ProductTypePayloadTypes>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Name" />,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter by name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'days',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Days" />,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: daysFilterOptions,
        filterPlaceholder: "Filter by days...",
      } as ColumnMeta,
    },
    {
      id: 'created_by',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Created by" />,
      accessorFn: (row) => userMap.get(row.created_by) || 'Unknown User',
      cell: ({ row }) => <div>{row.getValue("created_by")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: createdByFilterOptions,
        filterPlaceholder: "Filter by creator...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Status" />,
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
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original
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
              {rights?.can_edit === "1" &&
                <DropdownMenuItem onClick={() => setProductTypeId(record.id)} asChild>
                  <Link href={EDIT_ROUTE}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </Link>
                </DropdownMenuItem>
              }
              {
                rights?.can_edit === "1" &&
                <DropdownMenuItem>
                  <Trash className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  // ======== RENDER LOGIC ========
  const isLoading = productTypesListLoading || usersListLoading;
  const isError = productTypesListIsError || usersListIsError;
  const error = productTypesListError || usersListError;
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={errorMessage} />
  if (rights?.can_view === "0") return <Empty title="Permission Denied" description="You do not have permission to view product types." />


  return (
    <>
      <SubNav
        title="Product Types List"
        addBtnTitle="Add Product Type"
        urlPath={ADD_ROUTE}
      />
      <ProductTypesDatatable columns={columns} payload={productTypesList} />
    </>
  )
}

export default ProductTypesList
