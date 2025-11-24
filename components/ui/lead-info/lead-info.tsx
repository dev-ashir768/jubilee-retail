"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import SubNav from "../foundations/sub-nav";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFilterOptionsForLeadInfo,
  fetchLeadInfoList,
} from "@/helperFunctions/leadsFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import { ColumnDef } from "@tanstack/react-table";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "../shadcn/button";
import LeadInfoDatatable from "./lead-info-datatable";
import {
  LeadInfoPayloadTypes,
  LeadInfoResponseTypes,
} from "@/types/leadInfoTypes";
import { toast } from "sonner";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";

const LeadInfoList = () => {
  // ======== CONSTANTS & HOOKS ========

  const LISTING_ROUTE = "/leads/lead-info";
  const router = useRouter();

  const queryClient = useQueryClient();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMutate } = handleDeleteMutation();
  const { mutate: statusMutate, isPending: statusIsPending } =
    handleStatusMutation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== HANDLE STATUS UPDATE HIERARCHY ========
  const handleStatus = (id: number, status: string) => {
    updateLeadStatusMutation.mutate({ lead_info_id: id, status });
  };

  const renderMenuItems = (id: number, status: string) => {
    switch (status) {
      case "pending":
        return (
          <>
            <DropdownMenuItem onClick={() => handleStatus(id, "waiting")}>
              Waiting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatus(id, "interested")}>
              Interested
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatus(id, "not_interested")}
            >
              Not Interested
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatus(id, "callback_scheduled")}
            >
              Callback Scheduled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatus(id, "cancelled")}>
              Cancelled
            </DropdownMenuItem>
          </>
        );
      case "waiting":
        return (
          <>
            <DropdownMenuItem onClick={() => handleStatus(id, "interested")}>
              Interested
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatus(id, "not_interested")}
            >
              Not Interested
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatus(id, "callback_scheduled")}
            >
              Callback Scheduled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatus(id, "cancelled")}>
              Cancelled
            </DropdownMenuItem>
          </>
        );
      case "callback_scheduled":
        return (
          <>
            <DropdownMenuItem onClick={() => handleStatus(id, "interested")}>
              Interested
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatus(id, "not_interested")}
            >
              Not Interested
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatus(id, "cancelled")}>
              cancelled
            </DropdownMenuItem>
          </>
        );
      case "interested":
      case "not_interested":
      case "cancelled":
        return (
          <>
            <DropdownMenuItem disabled>Locked</DropdownMenuItem>
          </>
        );
      default:
        return null;
    }
  };

  // ======== DATA FETCHING ========
  const {
    data: LeadInfoListResponse,
    isLoading: LeadInfoListLoading,
    error: LeadInfoListError,
    isError: LeadInfoListIsError,
    isRefetching: leadInfoListIsRefetching,
    refetch: LeadInfoListRefetch,
  } = useQuery<LeadInfoResponseTypes | null>({
    queryKey: [
      "lead-info-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchLeadInfoList({
        startDate,
        endDate,
      }),
  });

  // ======== MUTATION ========
  const updateLeadStatusMutation = useMutation<
    LeadInfoResponseTypes,
    AxiosError<LeadInfoResponseTypes>,
    { lead_info_id: number; status: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/lead-infos/status",
        isServer: true,
        data: record,
      });
    },
    onMutate: () => {
      toast.info("Updating status...");
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Update status lead info mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            typeof queryKey[0] === "string" &&
            queryKey[0].startsWith("lead-info-list")
          );
        },
      });
    },
  });

  // ======== PAYLOADS DATA ========
  const leadInfoList = useMemo(
    () => LeadInfoListResponse?.payload || [],
    [LeadInfoListResponse]
  );

  // ======== FILTER OPTIONS ========
  const nameFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "name"),
    [leadInfoList]
  );
  const dobFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "dob"),
    [leadInfoList]
  );
  const ageFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "age"),
    [leadInfoList]
  );
  const mobileNumFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "mobile_num"),
    [leadInfoList]
  );
  const emailFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "email_address"),
    [leadInfoList]
  );
  const spouseDobFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "spouse_dob"),
    [leadInfoList]
  );
  const spouseAgeFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "spouse_age"),
    [leadInfoList]
  );
  const kidsFilterOptions = useMemo(
    () => createFilterOptionsForLeadInfo(leadInfoList, "kids"),
    [leadInfoList]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<LeadInfoPayloadTypes>[] = [
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
        filterPlaceholder: "Filter by name...",
      } as ColumnMeta,
    },
    {
      id: "dob",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="DOB" />
      ),
      accessorFn: (row) => row.dob || "N/A",
      cell: ({ row }) => <div>{row.getValue("dob")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: dobFilterOptions,
        filterPlaceholder: "Filter by dob...",
      } as ColumnMeta,
    },
    {
      accessorKey: "age",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Age" />
      ),
      accessorFn: (row) => row.age || "N/A",
      cell: ({ row }) => <div>{row.getValue("age")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: ageFilterOptions,
        filterPlaceholder: "Filter by age...",
      } as ColumnMeta,
    },
    {
      accessorKey: "mobile_num",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Mobile" />
      ),
      accessorFn: (row) => row.mobile_num || "N/A",
      cell: ({ row }) => <div>{row.getValue("mobile_num")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: mobileNumFilterOptions,
        filterPlaceholder: "Filter by mobile...",
      } as ColumnMeta,
    },
    {
      accessorKey: "email_address",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Email" />
      ),
      accessorFn: (row) => row.email_address || "N/A",
      cell: ({ row }) => <div>{row.getValue("email_address")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: emailFilterOptions,
        filterPlaceholder: "Filter by email...",
      } as ColumnMeta,
    },
    {
      accessorKey: "spouse_dob",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Spouse DOB" />
      ),
      accessorFn: (row) => row.spouse_dob || "N/A",
      cell: ({ row }) => <div>{row.getValue("spouse_dob")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: spouseDobFilterOptions,
        filterPlaceholder: "Filter by spouse DOB...",
      } as ColumnMeta,
    },
    {
      accessorKey: "spouse_age",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Spouse Age" />
      ),
      accessorFn: (row) => row.spouse_age || "N/A",
      cell: ({ row }) => <div>{row.getValue("spouse_age")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: spouseAgeFilterOptions,
        filterPlaceholder: "Filter by spouse age...",
      } as ColumnMeta,
    },
    {
      accessorKey: "kids",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Kids" />
      ),
      accessorFn: (row) => row.kids ?? "N/A",
      cell: ({ row }) => <div>{String(row.getValue("kids"))}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: kidsFilterOptions,
        filterPlaceholder: "Filter by kids...",
      } as ColumnMeta,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Lead Info Status" />
      ),
      cell: ({ row }) => {
        const { status, id } = row.original;
        const currentStatus = status as string;
        const isLocked = ["interested", "not_interested", "cancelled"].includes(
          currentStatus
        );

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              disabled={isLocked}
              className="disabled:cursor-not-allowed"
            >
              <Badge
                variant={
                  currentStatus as
                    | "waiting"
                    | "interested"
                    | "not_interested"
                    | "cancelled"
                    | "waiting"
                    | "callback_scheduled"
                    | "pending"
                }
              >
                {currentStatus.replace(/_/g, " ")}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {renderMenuItems(id, currentStatus)}
            </DropdownMenuContent>
          </DropdownMenu>
        );
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
        module: process.env.NEXT_PUBLIC_PATH_LEADINFO!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "lead-info-list",
              ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
            ],
          });
          setSelectedRecordId(null);
        },
      }
    );
  };

  const handleStatusUpdate = (id: number) => {
    statusMutate(
      {
        module: process.env.NEXT_PUBLIC_PATH_LEADINFO!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "lead-info-list",
              ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
            ],
          });
        },
      }
    );
  };

  const handleRefetch = useCallback(async () => {
    const toastId = "lead-info-list-refetch-toast";

    toast.loading("Refetching...", { id: toastId });

    try {
      const { isSuccess } = await LeadInfoListRefetch();

      if (isSuccess) {
        toast.success("Refetched Successfully!", { id: toastId });
      } else {
        toast.error("Failed to fetch data.", { id: toastId });
      }
    } catch (error) {
      toast.error(`${error}: An error occurred.`, { id: toastId });
    }
  }, [LeadInfoListRefetch]);

  // ======== RENDER LOGIC ========
  const isLoading = LeadInfoListLoading;
  const isError = LeadInfoListIsError;
  const onError = LeadInfoListError?.message;

  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (rights && rights?.can_view === "0")
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

    if (!leadInfoList || leadInfoList.length === 0) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return (
      <LeadInfoDatatable
        columns={columns}
        payload={leadInfoList}
        isRefetching={leadInfoListIsRefetching}
        handleRefetch={handleRefetch}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Lead Info List"
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
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

export default LeadInfoList;
