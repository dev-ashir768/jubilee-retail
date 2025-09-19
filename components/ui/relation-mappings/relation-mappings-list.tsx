"use client";

import { fetchRelationMappingsList } from '@/helperFunctions/relationMappingsFunction';
import { fetchUserList } from '@/helperFunctions/userFunction';
import useRelationMappingsIdStore from '@/hooks/useRelationMappingsIdStore';
import { RelationMappingsPayloadTypes, RelationMappingsResponseTypes } from '@/types/relationMappingsTypes';
import { UserResponseType } from '@/types/usersTypes';
import { getRights } from '@/utils/getRights';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useEffect } from 'react'
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';
import { ColumnMeta } from '@/types/dataTableTypes';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../shadcn/badge';
import RelationMappingsDatatable from './relation-mappings-datatable';
import SubNav from '../foundations/sub-nav';
import { useRouter } from 'next/navigation';

const RelationMappingsList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = '/settings/add-relation-mapping';
  const EDIT_ROUTE = '/settings/edit-relation-mapping';
  const LISTING_ROUTE = '/mapping/relation-mapper'
  const { setRelationMappingId } = useRelationMappingsIdStore();
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])

  // ======== DATA FETCHING ========
  const { data: relationMappingsListResponse, isLoading: relationMappingsListLoading, isError: relationMappingsListIsError, error: relationMappingsListError } = useQuery<RelationMappingsResponseTypes | null>({
    queryKey: ['relation-mappings-list'],
    queryFn: fetchRelationMappingsList
  });

  const { data: usersListResponse, isLoading: usersListLoading, isError: usersListIsError, error: usersListError } = useQuery<UserResponseType | null>({
    queryKey: ['users-list'],
    queryFn: fetchUserList
  });

  // ======== PAYLOADS DATA ========
  const relationMappingsList = useMemo(() => relationMappingsListResponse?.payload || [], [relationMappingsListResponse]);
  const usersList = useMemo(() => usersListResponse?.payload || [], [usersListResponse]);

  // ======== LOOKUP MAPS ========
  const userMap = useMemo(() => {
    if (!usersList.length) return new Map();
    return new Map(usersList.map((user) => [user.id, user.fullname]));
  }, [usersList]);

  // ======== FILTER OPTIONS ========
  const useCreateFilterOptions = (
    list: RelationMappingsPayloadTypes[], // Accept the list as the first argument
    key: keyof RelationMappingsPayloadTypes
  ) => {
    return useMemo(() => {
      if (!list || !list.length) return [];
      const uniqueValues = Array.from(new Set(list.map(item => item[key])));
      return uniqueValues.map(value => ({
        label: String(value),
        value: String(value),
      }));
    }, [list, key]); // Now, 'list' is a proper dependency
  };

  const nameFilterOptions = useCreateFilterOptions(relationMappingsList, 'name');
  const shortKeyFilterOptions = useCreateFilterOptions(relationMappingsList, 'short_key');
  const genderFilterOptions = useCreateFilterOptions(relationMappingsList, 'gender');

  const createdByFilterOptions = useMemo(() => {
    if (!relationMappingsList.length || !userMap.size) return [];
    const creatorIdsInList = new Set(relationMappingsList.map(item => item.created_by));
    return Array.from(creatorIdsInList).reduce((options, id) => {
      const name = userMap.get(id);
      if (name) {
        options.push({ label: name, value: name });
      }
      return options;
    }, [] as { label: string, value: string }[]);
  }, [relationMappingsList, userMap]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<RelationMappingsPayloadTypes>[] = [
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
      accessorKey: 'short_key',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Short Key" />,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: shortKeyFilterOptions,
        filterPlaceholder: "Filter by key...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Gender" />,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: genderFilterOptions,
        filterPlaceholder: "Filter by gender...",
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
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit === "1" &&
                <DropdownMenuItem onClick={() => setRelationMappingId(record.id)} asChild>
                  <Link href={EDIT_ROUTE}><Edit className='mr-2 h-4 w-4' />Edit</Link>
                </DropdownMenuItem>
              }
              {rights?.can_delete === "1" &&
                <DropdownMenuItem><Trash className='mr-2 h-4 w-4' />Delete</DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  // ======== RENDER LOGIC ========

  useEffect(() => {
    if (!rights) return;
    if (rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  const isLoading = relationMappingsListLoading || usersListLoading;
  const isError = relationMappingsListIsError || usersListIsError;
  const error = relationMappingsListError || usersListError;
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={errorMessage} />;
  if (rights?.can_view === "0") return <Empty title="Permission Denied" description="You do not have rights to view Relation Mappings." />;


  return (
    <>
      <SubNav
        title="Relation Mappings List"
        addBtnTitle="Add Relation"
        urlPath={ADD_ROUTE}
      />
      <RelationMappingsDatatable columns={columns} payload={relationMappingsList} />
    </>
  )
}

export default RelationMappingsList
