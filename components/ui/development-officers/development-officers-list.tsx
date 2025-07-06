"use client";

import { fetchDevelopmentOfficerList } from '@/helperFunctions/developmentOfficerFunction';
import { DevelopmentOfficerPayloadTypes, DevelopmentOfficerResponseTypes } from '@/types/developmentOfficerTypes';
import { getRights } from '@/utils/getRights';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import Error from '../foundations/error';
import Loader from '../foundations/loader';
import Empty from '../foundations/empty';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnMeta } from '@/types/dataTableTypes';
import { Badge } from '../shadcn/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import SubNav from '../foundations/sub-nav';
import DataTable from '../datatable/data-table';
import useDevelopmentOfficerIdStore from '@/hooks/useDevelopmentOfficerStore';

const DevelopmentOfficersList = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Zustand
  const { setDevelopmentOfficerId } = useDevelopmentOfficerIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  if (rights?.can_view === "0") {
    router.back();
  }

  // Fetch development officer list data using react-query
  const { data: developmentOfficerListResponse, isLoading: developmentOfficerListLoading, isError: developmentOfficerListIsError, error } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ['development-officers-list'],
    queryFn: fetchDevelopmentOfficerList,
  });

  // Column filter options
  const nameFilterOptions = useMemo(() => {
    const allNames = developmentOfficerListResponse?.payload?.map((item) => item.name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [developmentOfficerListResponse]);

  const igisCodeFilterOptions = useMemo(() => {
    const allIgisCodes = developmentOfficerListResponse?.payload?.map((item) => item.igis_code) || [];
    const uniqueIgisCodes = Array.from(new Set(allIgisCodes));
    return uniqueIgisCodes.map((igis_code) => ({
      label: igis_code,
      value: igis_code,
    }));
  }, [developmentOfficerListResponse]);

  const branchIdFilterOptions = useMemo(() => {
    const allBranchIds = developmentOfficerListResponse?.payload?.map((item) => item.branch_id.toString()) || [];
    const uniqueBranchIds = Array.from(new Set(allBranchIds));
    return uniqueBranchIds.map((branch_id) => ({
      label: branch_id,
      value: branch_id,
    }));
  }, [developmentOfficerListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<DevelopmentOfficerPayloadTypes>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'igis_code',
      header: ({ column }) => <DatatableColumnHeader column={column} title="IGIS Code" />,
      cell: ({ row }) => <div>{row.getValue("igis_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisCodeFilterOptions,
        filterPlaceholder: "Filter IGIS code...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Status" />,
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as string;
        return (
          <Badge className="justify-center py-1 min-w-[50px] w-[70px]" variant={status === "active" ? "success" : "danger"}>
            {status}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ],
        filterPlaceholder: "Filter status...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'branch_id',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Branch ID" />,
      cell: ({ row }) => <div>{row.getValue("branch_id")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: branchIdFilterOptions,
        filterPlaceholder: "Filter branch ID...",
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit === "1" && (
                <DropdownMenuItem onClick={() => setDevelopmentOfficerId(record.id)} asChild>
                  <Link href="/branches-clients/edit-development-officer">
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

  // Loading state
  if (developmentOfficerListLoading) {
    return <Loader />;
  }

  // Error state
  if (developmentOfficerListIsError) {
    return <Error err={error} />;
  }

  // Empty state
  if (!developmentOfficerListResponse?.payload || developmentOfficerListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No development officers found" />;
  }

  return (
    <>
      <SubNav title="Development Officer List" addBtnTitle="Add Development Officer" urlPath='/' />
      <DataTable
        columns={columns}
        data={developmentOfficerListResponse?.payload || []}
        title="List of all development officers in the system"
      />
    </>
  );
};

export default DevelopmentOfficersList;