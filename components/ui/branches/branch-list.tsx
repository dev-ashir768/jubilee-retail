"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../shadcn/card'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import DataTable from '../datatable/data-table';
import { Branch } from '@/types/branches';
import { ColumnDef } from '@tanstack/react-table';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnMeta } from '@/types/dataTableTypes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';

const BranchList = () => {

  // Static data for branches
  const branchesData: Branch[] = [
    {
      id: '1',
      branchName: 'Main Branch',
      managerFirstName: 'John',
      managerLastName: 'Doe',
      username: 'john.doe',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      branchName: 'Downtown Branch',
      managerFirstName: 'Jane',
      managerLastName: 'Smith',
      username: 'jane.smith',
      status: 'active',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10'
    },
    {
      id: '3',
      branchName: 'Westside Branch',
      managerFirstName: 'Mike',
      managerLastName: 'Johnson',
      username: 'mike.johnson',
      status: 'inactive',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05'
    },
    {
      id: '4',
      branchName: 'Eastside Branch',
      managerFirstName: 'Sarah',
      managerLastName: 'Williams',
      username: 'sarah.williams',
      status: 'active',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20'
    },
    {
      id: '5',
      branchName: 'North Branch',
      managerFirstName: 'David',
      managerLastName: 'Brown',
      username: 'david.brown',
      status: 'active',
      createdAt: '2024-04-01',
      updatedAt: '2024-04-01'
    }
  ];

  // Column filter options
  const branchNameFilterOptions = useMemo(() => {
    const allBranchNames = branchesData.map((item) => item.branchName);
    const uniqueBranchNames = Array.from(new Set(allBranchNames));
    return uniqueBranchNames.map((branchName) => ({
      label: branchName,
      value: branchName,
    }));
  }, []);

  const managerFilterOptions = useMemo(() => {
    const allManagers = branchesData.map((item) => `${item.managerFirstName} ${item.managerLastName}`);
    const uniqueManagers = Array.from(new Set(allManagers));
    return uniqueManagers.map((manager) => ({
      label: manager,
      value: manager,
    }));
  }, []);

  const usernameFilterOptions = useMemo(() => {
    const allUsernames = branchesData.map((item) => item.username);
    const uniqueUsernames = Array.from(new Set(allUsernames));
    return uniqueUsernames.map((username) => ({
      label: username,
      value: username,
    }));
  }, []);

  const statusFilterOptions = useMemo(() => {
    const allStatuses = branchesData.map((item) => item.status);
    const uniqueStatuses = Array.from(new Set(allStatuses));
    return uniqueStatuses.map((status) => ({
      label: status,
      value: status,
    }));
  }, []);

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: 'branchName',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Branch Name" />,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("branchName")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: branchNameFilterOptions,
        filterPlaceholder: "Filter branch name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'manager',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Manager' />,
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div>{`${branch.managerFirstName} ${branch.managerLastName}`}</div>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: managerFilterOptions,
        filterPlaceholder: "Filter manager...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Username' />,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("username")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: usernameFilterOptions,
        filterPlaceholder: "Filter username...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: statusFilterOptions,
        filterPlaceholder: "Filter status...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Created Date' />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div>{date.toLocaleDateString()}</div>
        );
      },
    },
    {
      id: 'actions',
      header: "Actions",
      cell: () => {
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
              <DropdownMenuItem>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ];

  return (
    <>
      <SubNav
        title="Branch Management"
      />

      <Card className='shadow-none border-none'>
        <CardHeader className='border-b'>
          <CardTitle>Branch List</CardTitle>
          <CardDescription>List of all branches in the system.</CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={branchesData}
            exportFilename='branch_list'
          />
        </CardContent>

        <CardFooter>
          <p>Total Branches: {branchesData.length}</p>
        </CardFooter>
      </Card>
    </>
  )
}

export default BranchList