"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardHeader, CardTitle } from '../shadcn/card'
import { useQuery } from '@tanstack/react-query'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import DataTable from '../datatable/data-table';
import { DoListPayloadType, DoListResponseType } from '@/types/doTypes';
import { ColumnDef } from '@tanstack/react-table';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnMeta } from '@/types/dataTableTypes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';
import Loader from '../foundations/loader';
import Error from '../foundations/error';
import { getRights } from '@/utils/getRights';

const DoList = () => {

  const rights = getRights('/do/do-list');
  console.log("Do List Rights: ", rights);

  // Mock fetch function - replace with actual API call
  const fetchDoList = async (): Promise<DoListResponseType> => {
    // This would be replaced with actual API call
    return {
      status: 1,
      message: "Success",
      payload: [
        {
          id: 1,
          title: "Complete project documentation",
          description: "Write comprehensive documentation for the retail management system",
          priority: "high",
          status: "in_progress",
          due_date: "2024-12-31",
          assigned_to: 1,
          assigned_user: {
            id: 1,
            fullname: "John Doe",
            username: "johndoe"
          },
          is_active: true,
          is_deleted: false,
          created_by: 1,
          deleted_by: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          deleted_at: null
        }
      ]
    };
  };

  const { data: doListResponse, isLoading: doListLoading, isError: doListIsError, error } = useQuery<DoListResponseType | null>({
    queryKey: ['do-list'],
    queryFn: fetchDoList
  })

  // Column filter options
  const titleFilterOptions = useMemo(() => {
    const allTitles = doListResponse?.payload?.map((item) => item.title) || [];
    const uniqueTitles = Array.from(new Set(allTitles));
    return uniqueTitles.map((title) => ({
      label: title,
      value: title,
    }));
  }, [doListResponse]);

  const priorityFilterOptions = useMemo(() => {
    const allPriorities = doListResponse?.payload?.map((item) => item.priority) || [];
    const uniquePriorities = Array.from(new Set(allPriorities));
    return uniquePriorities.map((priority) => ({
      label: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: priority,
    }));
  }, [doListResponse]);

  const statusFilterOptions = useMemo(() => {
    const allStatuses = doListResponse?.payload?.map((item) => item.status) || [];
    const uniqueStatuses = Array.from(new Set(allStatuses));
    return uniqueStatuses.map((status) => ({
      label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: status,
    }));
  }, [doListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<DoListPayloadType>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Title" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        columnName: "Title",
        filterOptions: titleFilterOptions,
      } as ColumnMeta,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Description" />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-xs truncate" title={description}>
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Priority" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        const priorityColors = {
          low: "bg-green-100 text-green-800",
          medium: "bg-yellow-100 text-yellow-800", 
          high: "bg-red-100 text-red-800"
        };
        return (
          <Badge className={priorityColors[priority as keyof typeof priorityColors]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        );
      },
      meta: {
        columnName: "Priority",
        filterOptions: priorityFilterOptions,
      } as ColumnMeta,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors = {
          pending: "bg-gray-100 text-gray-800",
          in_progress: "bg-blue-100 text-blue-800",
          completed: "bg-green-100 text-green-800"
        };
        return (
          <Badge className={statusColors[status as keyof typeof statusColors]}>
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        );
      },
      meta: {
        columnName: "Status",
        filterOptions: statusFilterOptions,
      } as ColumnMeta,
    },
    {
      accessorKey: "assigned_user.fullname",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Assigned To" />
      ),
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Due Date" />
      ),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const dueDate = row.getValue("due_date") as string;
        return new Date(dueDate).toLocaleDateString();
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit && (
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {rights?.can_delete && (
                <DropdownMenuItem className="text-red-600">
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

  // Sub navigation data
  const subNavData = [
    {
      title: "Task List",
      href: "/do/do-list",
      description: "View all tasks",
      isActive: true,
    },
    {
      title: "Add Task",
      href: "/do/add-do",
      description: "Create a new task",
      isActive: false,
    },
  ];

  if (doListLoading) {
    return <Loader />;
  }

  if (doListIsError) {
    return <Error message={error?.message || "Failed to load tasks"} />;
  }

  return (
    <>
      <SubNav items={subNavData} />
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
          </CardHeader>

          <div className="px-6 pb-6">
            <DataTable
              columns={columns}
              data={doListResponse?.payload || []}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default DoList;