"use client";

import React, { useEffect, useMemo, useState } from "react";
import SubNav from "../foundations/sub-nav";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllUserList,
} from "@/helperFunctions/userFunction";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  UsersListPayloadType,
  UsersListResponseType,
} from "@/types/usersTypes";
import { ColumnDef } from "@tanstack/react-table";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { Badge } from "../shadcn/badge";
import Error from "../foundations/error";
import { getRights } from "@/utils/getRights";
import { redirect, usePathname } from "next/navigation";
import Empty from "../foundations/empty";
import Link from "next/link";
import useUserIdStore from "@/hooks/useAddUserIdStore";
import UserDatatable from "./user-datatable";
import LoadingState from "../foundations/loading-state";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";

const UserList = () => {
  // ======== CONSTANTS AND HOOKS ========
  const ADD_ROUTE = "/users/add-user";
  const pathname = usePathname();
  const { setUserId } = useUserIdStore();

  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();
  const queryClient = useQueryClient();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // ======== DATA FETCHING ========
  const {
    data: userListResponse,
    isLoading: userListLoading,
    isError: userListIsError,
    error: userListError,
  } = useQuery<UsersListResponseType | null>({
    queryKey: ["users-list"],
    queryFn: fetchAllUserList,
  });

  // ======== PAYLOADS DATA ========
  const userList = useMemo(
    () => userListResponse?.payload || [],
    [userListResponse]
  );

  // ======== FILTER OPTIONS ========
  const fullnameFilterOptions = useMemo(() => {
    const allFullname =
      userListResponse?.payload?.map((item) => item.fullname) || [];
    const uniqueFullname = Array.from(new Set(allFullname));
    return uniqueFullname.map((fullname) => ({
      label: fullname,
      value: fullname,
    }));
  }, [userListResponse]);

  const usernameFilterOptions = useMemo(() => {
    const allUsername =
      userListResponse?.payload?.map((item) => item.username) || [];
    const uniqueUsername = Array.from(new Set(allUsername));
    return uniqueUsername.map((username) => ({
      label: username,
      value: username,
    }));
  }, [userListResponse]);

  const emailFilterOptions = useMemo(() => {
    const allEmail = userListResponse?.payload?.map((item) => item.email) || [];
    const uniqueEmail = Array.from(new Set(allEmail));
    return uniqueEmail.map((email) => ({
      label: email,
      value: email,
    }));
  }, [userListResponse]);

  const phoneFilterOptions = useMemo(() => {
    const allPhone = userListResponse?.payload?.map((item) => item.phone) || [];
    const uniquePhone = Array.from(new Set(allPhone));
    return uniquePhone.map((phone) => ({
      label: phone,
      value: phone,
    }));
  }, [userListResponse]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<UsersListPayloadType>[] = [
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Fullname" />
      ),
      cell: ({ row }) => <div>{row.getValue("fullname")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullnameFilterOptions,
        filterPlaceholder: "Filter fullname...",
      } as ColumnMeta,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Username" />
      ),
      cell: ({ row }) => <div>{row.getValue("username")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: usernameFilterOptions,
        filterPlaceholder: "Filter username...",
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: emailFilterOptions,
        filterPlaceholder: "Filter email...",
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: phoneFilterOptions,
        filterPlaceholder: "Filter phone...",
      },
    },
    {
      accessorKey: "user_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="User Type" />
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.user_type.replace("_", " ")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Dashboard User", value: "dashboard_user" },
          { label: "API User", value: "api_user" },
        ],
        filterPlaceholder: "Filter user type...",
      },
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as string;
        const id = row.original?.id;
        return (
          <Badge
            className={`justify-center py-1 min-w-[50px] w-[70px]`}
            variant={status === "active" ? "success" : "danger"}
            onClick={statusIsPending ? undefined : () => handleStatusUpdate(id)}
          >
            {status}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
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
                <DropdownMenuItem onClick={() => setUserId(record.id)} asChild>
                  <Link href={`/users/edit-user`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {rights?.can_delete === "1" && (
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteDialogOpen(true);
                    setSelectedRecordId(record.id);
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ======== HANDLE ========

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_USER!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["users-list"],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_USER!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["users-list"],
          });
        },
      }
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading = userListLoading;
  const isError = userListIsError;
  const onError = userListError?.message;

  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights]);

  if ((rights && rights?.can_view === "0") || !rights?.can_view)
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

    if (!userList || userList.length === 0) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return (
      <UserDatatable
        columns={columns}
        payload={userListResponse?.payload || []}
      />
    );
  };

  return (
    <>
      <SubNav
        title="User Management"
        addBtnTitle="Add User"
        urlPath={ADD_ROUTE}
      />

      {renderPageContent()}

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default UserList;
