"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchClientList } from "@/helperFunctions/clientFunction";
import useClientIdStore from "@/hooks/useClientIdStore";
import { ClientPayloadType, ClientResponseType } from "@/types/clientTypes";
import { getRights } from "@/utils/getRights";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect, usePathname } from "next/navigation";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "../shadcn/button";
import Link from "next/link";
import SubNav from "../foundations/sub-nav";
import ClientDatatable from "./client-datatable";
import LoadingState from "../foundations/loading-state";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import ClientFilters from "../filters/client-filter";
import { BranchResponseType } from "@/types/branchTypes";
import { fetchAllBranchList } from "@/helperFunctions/branchFunction";
import { clientFilterState } from "@/hooks/clientFilterState";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { getUserInfo } from "@/utils/getUserInfo";

const ClientList = () => {
  // Constants
  const userInfo = getUserInfo();
  const ADD_URL = "/branches-clients/add-clients";
  const EDIT_URL = "/branches-clients/edit-clients";
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();
  const { filterValue } = clientFilterState();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";
  const defaultRange = {
    from: startOfMonth(new Date()),
    to: new Date(),
  };

  // Zustand
  const { setClientId } = useClientIdStore();

  // Fetch client list data using react-query
  const {
    data: clientListResponse,
    isLoading: clientListLoading,
    isError: clientListIsError,
    error: clientListError,
  } = useQuery<ClientResponseType | null>({
    queryKey: [
      "clients-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
      ...(filterValue?.branch ? [filterValue?.branch] : []),
    ],
    queryFn: () =>
      fetchClientList({
        startDate,
        endDate,
        branch: filterValue?.branch ?? null,
      }),
  });

  const {
    data: branchListResponse,
    isLoading: branchListLoading,
    isError: branchListIsError,
    error: branchListError,
  } = useQuery<BranchResponseType | null>({
    queryKey: ["all-branch-list"],
    queryFn: fetchAllBranchList,
  });

  // Column filter options
  const nameFilterOptions = useMemo(() => {
    const allNames =
      clientListResponse?.payload?.map((item) => item.name) || [];
    const uniqueNames = Array.from(
      new Set(allNames.filter((name) => name !== null)),
    );
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [clientListResponse]);

  const igisClientCodeFilterOptions = useMemo(() => {
    const allIgisClientCodes =
      clientListResponse?.payload?.map((item) => item.igis_client_code) || [];
    const uniqueIgisClientCodes = Array.from(new Set(allIgisClientCodes));
    return uniqueIgisClientCodes.map((igis_client_code) => ({
      label: igis_client_code,
      value: igis_client_code,
    }));
  }, [clientListResponse]);

  const addressFilterOptions = useMemo(() => {
    const allAddresses =
      clientListResponse?.payload?.map((item) => item.address) || [];
    const uniqueAddresses = Array.from(new Set(allAddresses));
    return uniqueAddresses.map((address) => ({
      label: address,
      value: address,
    }));
  }, [clientListResponse]);

  const telephoneFilterOptions = useMemo(() => {
    const allTelephones =
      clientListResponse?.payload?.map((item) => item.telephone) || [];
    const uniqueTelephones = Array.from(new Set(allTelephones));
    return uniqueTelephones.map((telephone) => ({
      label: telephone,
      value: telephone,
    }));
  }, [clientListResponse]);

  const contactPersonFilterOptions = useMemo(() => {
    const allContactPersons =
      clientListResponse?.payload?.map((item) => item.contact_person) || [];
    const uniqueContactPersons = Array.from(new Set(allContactPersons));
    return uniqueContactPersons.map((contact_person) => ({
      label: contact_person,
      value: contact_person,
    }));
  }, [clientListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<ClientPayloadType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "igis_client_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="IGIS Client Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("igis_client_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisClientCodeFilterOptions,
        filterPlaceholder: "Filter IGIS client code...",
      } as ColumnMeta,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => <div>{row.getValue("address")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: addressFilterOptions,
        filterPlaceholder: "Filter address...",
      } as ColumnMeta,
    },
    {
      accessorKey: "telephone",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Telephone" />
      ),
      cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: telephoneFilterOptions,
        filterPlaceholder: "Filter telephone...",
      } as ColumnMeta,
    },
    {
      accessorKey: "contact_person",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Contact Person" />
      ),
      cell: ({ row }) => <div>{row.getValue("contact_person")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: contactPersonFilterOptions,
        filterPlaceholder: "Filter contact person...",
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
          <>
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
                    onClick={() => setClientId(record.id)}
                    asChild
                  >
                    <Link href={EDIT_URL}>
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
          </>
        );
      },
    },
  ];

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // ======== HANDLE ========
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    deleteMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_CLIENT!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "clients-list",
              ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
              ...(filterValue?.branch ? [filterValue?.branch] : []),
            ],
          });
          setSelectedRecordId(null);
        },
      },
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_CLIENT!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "clients-list",
              ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
              ...(filterValue?.branch ? [filterValue?.branch] : []),
            ],
          });
        },
      },
    );
  };

  // ======== FETCH PAYLOAD ========
  const branchList = useMemo(
    () => branchListResponse?.payload || [],
    [branchListResponse],
  );

  // ======== RENDER LOGIC ========
  const isLoading = clientListLoading || branchListLoading;
  const isError = clientListIsError || branchListIsError;
  const onError = clientListError?.message || branchListError?.message;

  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect(userInfo?.redirection_url ? userInfo.redirection_url : "/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, userInfo]);

  if (rights && rights?.can_view === "0") {
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );
  }

  const renderPageContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isError) {
      return <Error err={onError} />;
    }

    if (
      !clientListResponse?.payload ||
      clientListResponse.payload.length === 0
    ) {
      return <Empty title="Not Found" description="No clients found" />;
    }
    return (
      <>
        <ClientDatatable
          columns={columns}
          payload={clientListResponse?.payload || []}
        />
      </>
    );
  };

  return (
    <>
      <SubNav
        title="Client List"
        addBtnTitle="Add Client"
        urlPath={ADD_URL}
        datePicker={true}
        dateRange={dateRange}
        defaultDate={defaultRange}
        setDateRange={setDateRange}
        filter={true}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {renderPageContent()}

      <ClientFilters
        branchList={branchList}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      <DeleteDialog
        isDialogOpen={deleteDialogOpen}
        setIsDialogOpen={setDeleteDialogOpen}
        handleConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default ClientList;
