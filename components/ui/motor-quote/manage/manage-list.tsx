"use client";

import { fetchUserList } from '@/helperFunctions/userFunction';
import { UserResponseType } from '@/types/usersTypes';
import { getRights } from '@/utils/getRights';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react'
import LoadingState from '../../foundations/loading-state';
import Error from '../../foundations/error';
import Empty from '../../foundations/empty';
import SubNav from '../../foundations/sub-nav';
import ManageDatatable from './manage-datatable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../shadcn/dropdown-menu';
import { Button } from '../../shadcn/button';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import DatatableColumnHeader from '../../datatable/datatable-column-header';
import { ColumnMeta } from '@/types/dataTableTypes';
import { Badge } from '../../shadcn/badge';
import { MotorQuotePayloadTypes, MotorQuoteResponseTypes } from '@/types/motorQuote';
import useMotorQuoteIdStore from '@/hooks/useMotorQuoteIdStore';
import { fetchMotorQuoteList } from '@/helperFunctions/motorQuoteFunctions';
import { IgisMakeResponseType, IgisSubMakeResponseType } from '@/types/igisTypes';
import { fetchIgisMakeList, fetchIgisSubMakeList } from '@/helperFunctions/igisFunction';

const MotorQuoteList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_URL = '/motor-quote/add-manage'
  const EDIT_URL = '/motor-quote/edit-manage'
  const pathname = usePathname();
  const { setMotorQuoteId } = useMotorQuoteIdStore();


  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(pathname) }, [pathname])

  // ======== DATA FETCHING ========
  const { isLoading: usersListLoading, isError: usersListIsError, error: usersListError } = useQuery<UserResponseType | null>({
    queryKey: ['users-list'],
    queryFn: fetchUserList
  })

  const { isLoading: igisMakeListLoading, isError: igisMakeListIsError, error: igisMakeListError } = useQuery<IgisMakeResponseType | null>({
    queryKey: ['igis-make-list'],
    queryFn: fetchIgisMakeList,
  });

  const { data: motorQuoteListResponse, isLoading: motorQuoteListLoading, isError: motorQuoteListIsError, error: motorQuoteListError } = useQuery<MotorQuoteResponseTypes | null>({
    queryKey: ['motor-quote-list'],
    queryFn: fetchMotorQuoteList
  })

  const { isLoading: igisSubMakeListLoading, isError: igisSubMakeListIsError, error: igisSubMakeListError } = useQuery<IgisSubMakeResponseType | null>({
    queryKey: ['igis-sub-make-list'],
    queryFn: fetchIgisSubMakeList,
  });

  // const { data: agentListResponse, isLoading: agentListLoading, isError: agentListIsError, error: agentListError } = useQuery<AgentResponseTypes | null>({
  //   queryKey: ['agents-list'],
  //   queryFn: fetchAgentList,
  // });

  // const { data: branchListResponse, isLoading: branchListLoading, isError: branchListIsError, error } = useQuery<BranchResponseType | null>({
  //   queryKey: ['branch-list'],
  //   queryFn: fetchBranchList
  // })

  // const { data: cityListResponse, isLoading: cityListLoading, isError: cityListIsError, error: cityListError } = useQuery<CityResponseType | null>({
  //   queryKey: ['city-list'],
  //   queryFn: fetchCityList,
  // });

  // ======== PAYLOADS DATA ========
  // const usersList = useMemo(() => usersListResponse?.payload || [], [usersListResponse]);
  const motorQuoteList = useMemo(() => motorQuoteListResponse?.payload || [], [motorQuoteListResponse]);

  // ======== LOOKUPS ========
  // const userMap = useMemo(() => {
  //   if (!usersList || usersList.length === 0) return new Map();
  //   return new Map(usersList.map((user) => [user.id, user.fullname]))
  // }, [usersList])

  // const igisMakeMap = useMemo(() => {
  //   if (!igisMakeList || igisMakeList.length === 0) return new Map();
  //   return new Map(igisMakeList.map((make) => [make.id, make.make_name]))
  // }, [igisMakeList])

  // const igisSubMakeMap = useMemo(() => {
  //   if (!igisMakeList || igisSubMakeList.length === 0) return new Map();
  //   return new Map(igisSubMakeList.map((make) => [make.id, make.sub_make_name]))
  // }, [igisSubMakeList])

  // ======== FILTER OPTIONS ========
  const nameFilterOptions = useMemo(() => {
    if (!motorQuoteList) return []
    const uniqueName = Array.from(new Set(motorQuoteList.map((item) => item.name)))
    return uniqueName.map((name) => ({
      label: name,
      value: name,
    }))
  }, [motorQuoteList])

  const emailFilterOptions = useMemo(() => {
    if (!motorQuoteList) return []
    const uniqueEmail = Array.from(new Set(motorQuoteList.map((item) => item.email)))
    return uniqueEmail.map((email) => ({
      label: email || "N/A",
      value: email || "N/A",
    }))
  }, [motorQuoteList]);

  const mobileFilterOptions = useMemo(() => {
    if (!motorQuoteList) return []
    const uniqueMobile = Array.from(new Set(motorQuoteList.map((item) => item.mobile)))
    return uniqueMobile.map((mobile) => ({
      label: mobile || "N/A",
      value: mobile || "N/A",
    }))
  }, [motorQuoteList]);

  const rateFilterOptions = useMemo(() => {
    if (!motorQuoteList) return []
    const uniqueRate = Array.from(new Set(motorQuoteList.map((item) => item.rate)))
    return uniqueRate.map((rate) => ({
      label: rate || "N/A",
      value: rate || "N/A",
    }))
  }, [motorQuoteList]);

  // const vehicleMakeFilterOptions = useMemo(() => {
  //   if (!motorQuoteList || !igisMakeMap.size) return []
  //   const uniqueIds = Array.from(new Set(motorQuoteList.map((item) => item.vehicle_make)))
  //   return uniqueIds.map((vehicle_make) => (
  //     {
  //       label: igisMakeMap.get(vehicle_make),
  //       value: String(vehicle_make)
  //     }
  //   ))
  // }, [motorQuoteList, igisMakeMap])

  // const vehicleSubMakeFilterOptions = useMemo(() => {
  //   if (!motorQuoteList || !igisSubMakeMap.size) return []
  //   const uniqueIds = Array.from(new Set(motorQuoteList.map((item) => item.vehicle_submake)))
  //   return uniqueIds.map((vehicle_submake) => (
  //     {
  //       label: igisSubMakeMap.get(vehicle_submake),
  //       value: String(vehicle_submake)
  //     }
  //   ))
  // }, [motorQuoteList, igisSubMakeMap])

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<MotorQuotePayloadTypes>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div>{row.getValue("name")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter by name...",
      } as ColumnMeta,
    },
    {
      id: 'email',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Email" />,
      accessorFn: (row) => row.email || "N/A",
      cell: ({ row }) => (
        <div>{row.getValue("email")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: emailFilterOptions,
        filterPlaceholder: "Filter by email...",
      } as ColumnMeta,
    },
    {
      id: 'mobile',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Mobile" />,
      accessorFn: (row) => row.mobile || "N/A",
      cell: ({ row }) => (
        <div>{row.getValue("mobile")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: mobileFilterOptions,
        filterPlaceholder: "Filter by mobile...",
      } as ColumnMeta,
    },
    {
      id: 'rate',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Rate" />,
      accessorFn: (row) => row.rate || "N/A",
      cell: ({ row }) => (
        <div>{row.getValue("rate")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: rateFilterOptions,
        filterPlaceholder: "Filter by rate...",
      } as ColumnMeta,
    },
    // {
    //   accessorKey: 'vehicle_make',
    //   header: ({ column }) => <DatatableColumnHeader column={column} title="Vehicle Make" />,
    //   cell: ({ row }) => {
    //     const makeId = row.getValue("vehicle_make") as number;
    //     const makeName = igisMakeMap.get(makeId);
    //     return <div>{makeName || makeId || "N/A"}</div>;
    //   },
    //   filterFn: "multiSelect",
    //   meta: {
    //     filterType: "multiselect",
    //     filterOptions: vehicleMakeFilterOptions,
    //     filterPlaceholder: "Filter by vehicle make...",
    //   } as ColumnMeta,
    // },
    // {
    //   accessorKey: 'vehicle_submake',
    //   header: ({ column }) => <DatatableColumnHeader column={column} title="Vehicle Make" />,
    //   cell: ({ row }) => {
    //     const subMakeId = row.getValue("vehicle_submake") as number;
    //     const subMakeName = igisSubMakeMap.get(subMakeId);
    //     return <div>{subMakeName || subMakeId || "N/A"}</div>;
    //   },
    //   filterFn: "multiSelect",
    //   meta: {
    //     filterType: "multiselect",
    //     filterOptions: vehicleSubMakeFilterOptions,
    //     filterPlaceholder: "Filter by vehicle submake...",
    //   } as ColumnMeta,
    // },
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
                <DropdownMenuItem onClick={() => setMotorQuoteId(record.id)} asChild>
                  <Link href={EDIT_URL}><Edit className='mr-2 h-4 w-4' />Edit</Link>
                </DropdownMenuItem>
              }
              {
                rights?.can_edit === "1" &&
                <DropdownMenuItem>
                  <Trash className='mr-2 h-4 w-4' />Delete
                </DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  // ======== RENDER LOGIC ========
  const isLoading = usersListLoading || motorQuoteListLoading || igisMakeListLoading || igisSubMakeListLoading
  const isError = usersListIsError || motorQuoteListIsError || igisMakeListIsError || igisSubMakeListIsError
  const onError = usersListError?.message || motorQuoteListError?.message || igisMakeListError?.message || igisSubMakeListError?.message

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />
  if (rights?.can_view === "0") return <Empty title="Permission Denied" description="You do not have permission." />

  return (
    <>
      <SubNav
        title="Manage Motor Quote List"
        addBtnTitle="Add Plan"
        urlPath={ADD_URL}
      />

      <ManageDatatable columns={columns} payload={motorQuoteList} />
    </>
  )
}

export default MotorQuoteList
