"use client";

import { fetchCityList } from "@/helperFunctions/cityFunction";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnMeta } from "@/types/dataTableTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { Button } from "../shadcn/button";
import Link from "next/link";
import SubNav from "../foundations/sub-nav";
import { CityResponseType, CityPayloadType } from "@/types/cityTypes";
import CityDatatable from "./city-datatable";
import { getRights } from "@/utils/getRights";
import { Badge } from "../shadcn/badge";
import LoadingState from "../foundations/loading-state";
import useCityIdStore from "@/hooks/useCityIdStore";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";
import { UserResponseType } from "@/types/usersTypes";
import { fetchAllUserList } from "@/helperFunctions/userFunction";

const CityList = () => {
  // Constants
  const ADD_URL = "/cites-couiers/add-cities";
  const EDIT_URL = "/cites-couiers/edit-cities";

  const router = useRouter();
  const pathname = usePathname();
  const { setCityId } = useCityIdStore();

  const queryClient = useQueryClient();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();

  // Fetch city list data using react-query
  const {
    data: cityListResponse,
    isLoading: cityListLoading,
    isError: cityListIsError,
    error: cityListError,
  } = useQuery<CityResponseType | null>({
    queryKey: ["city-list"],
    queryFn: fetchCityList,
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

  // Column filter options
  const cityNameFilterOptions = useMemo(() => {
    const allNames =
      cityListResponse?.payload?.map((item) => item.city_name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [cityListResponse]);

  // ======== PAYLOADS DATA ========

  const usersList = useMemo(
    () => usersListResponse?.payload || [],
    [usersListResponse]
  );

  const usersMap = useMemo(() => {
    const map: Record<number, string> = {};
    usersList.forEach((user) => {
      map[user.id] = user.fullname;
    });
    return map;
  }, [usersList]);

  // Define columns for the data table
  const columns: ColumnDef<CityPayloadType>[] = [
    {
      accessorKey: "city_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="City Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("city_name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: cityNameFilterOptions,
        filterPlaceholder: "Filter city name...",
      } as ColumnMeta,
    },
    {
      id: "created_by",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Created by" />
      ),
      accessorFn: (row) => {
        return row?.created_by;
      },
      cell: ({ row }) => {
        const creatorId = row.original.created_by;
        const creatorName = usersMap[creatorId] ?? "N/A";
        return <div>{creatorName}</div>;
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
                <DropdownMenuItem asChild>
                  <Link href={EDIT_URL} onClick={() => setCityId(record.id)}>
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
        module: process.env.NEXT_PUBLIC_PATH_CITY!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["city-list"],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_CITY!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["city-list"],
          });
        },
      }
    );
  };

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view city listing."
      />
    );
  }

  // Loading state
  if (cityListLoading || usersListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (cityListIsError || usersListIsError) {
    return <Error err={cityListError?.message || usersListError?.message} />;
  }

  // Empty state
  if (!cityListResponse?.payload || cityListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No cities found" />;
  }

  return (
    <>
      <SubNav title="City List" addBtnTitle="Add City" urlPath={ADD_URL} />
      <CityDatatable
        columns={columns}
        payload={cityListResponse?.payload || []}
      />
      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default CityList;
