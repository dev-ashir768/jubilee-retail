"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import MotorInfoDatatable from "./motor-info-datatable";
import SubNav from "../foundations/sub-nav";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFilterOptions,
  fetchLeadsMotorInfoList,
} from "@/helperFunctions/leadsFunction";
import {
  LeadMotorInfoPayloadTypes,
  LeadMotorInfoResponseTypes,
} from "@/types/leadMotorInfoTypes";
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
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import DeleteDialog from "../common/delete-dialog";
import {
  handleDeleteMutation,
  handleStatusMutation,
} from "@/helperFunctions/commonFunctions";
import { formatNumberCell } from "@/utils/numberFormaterFunction";
import {
  fetchIgisMakeList,
  fetchIgisSubMakeList,
} from "@/helperFunctions/igisFunction";
import {
  IgisMakeResponseType,
  IgisSubMakeResponseType,
} from "@/types/igisTypes";

const MotorInfoList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/leads/lead-motor-info";

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
  const defaultRange = {
    from: startOfMonth(new Date()),
    to: new Date(),
  };

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== HANDLE STATUS UPDATE HIERARCHY ========
  const handleStatus = (id: number, status: string) => {
    updateLeadStatusMutation.mutate({ lead_motor_info_id: id, status });
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
    data: LeadsMotorInfoListResponse,
    isLoading: LeadsMotorInfoListLoading,
    error: LeadsMotorInfoListError,
    isError: LeadsMotorInfoListIsError,
    isRefetching: LeadsMotorInfoListIsRefetching,
    refetch: LeadsMotorInfoListRefetch,
  } = useQuery<LeadMotorInfoResponseTypes | null>({
    queryKey: [
      "lead-motor-info-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () =>
      fetchLeadsMotorInfoList({
        startDate,
        endDate,
      }),
  });

  // Fetch IGIS make list data using react-query
  const {
    data: igisMakeListResponse,
    isLoading: igisMakeListLoading,
    isError: igisMakeListIsError,
    error: igisMakeListError,
  } = useQuery<IgisMakeResponseType | null>({
    queryKey: ["igis-make-list"],
    queryFn: fetchIgisMakeList,
  });

  // Fetch IGIS sub-make list data using react-query
  const {
    data: igisSubMakeListResponse,
    isLoading: igisSubMakeListLoading,
    isError: igisSubMakeListIsError,
    error: igisSubMakeListError,
  } = useQuery<IgisSubMakeResponseType | null>({
    queryKey: ["igis-sub-make-list"],
    queryFn: fetchIgisSubMakeList,
  });

  // ======== MUTATION ========
  const updateLeadStatusMutation = useMutation<
    LeadMotorInfoResponseTypes,
    AxiosError<LeadMotorInfoResponseTypes>,
    { lead_motor_info_id: number; status: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/lead-motor-infos/status",
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
      console.log("Update status lead motor info mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            typeof queryKey[0] === "string" &&
            queryKey[0].startsWith("lead-motor-info-list")
          );
        },
      });
      router.replace(LISTING_ROUTE);
    },
  });

  // ======== PAYLOADS DATA ========

  // Column filter options
  const makeNameFilterOptions = useMemo(() => {
    const allNames =
      igisMakeListResponse?.payload?.map((item) => item.make_name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [igisMakeListResponse]);

  // Column filter options
  const subMakeNameFilterOptions = useMemo(() => {
    const allNames =
      igisSubMakeListResponse?.payload?.map((item) => item.sub_make_name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [igisSubMakeListResponse]);

  const leadsMotorInfoList = useMemo(
    () => LeadsMotorInfoListResponse?.payload || [],
    [LeadsMotorInfoListResponse]
  );

  const igisMakeList = useMemo(
    () => igisMakeListResponse?.payload || [],
    [igisMakeListResponse]
  );

  const igisSubMakeList = useMemo(
    () => igisSubMakeListResponse?.payload || [],
    [igisSubMakeListResponse]
  );

  // ======== FILTER OPTIONS ========
  const fullNameFilterOptions = useMemo(
    () => createFilterOptions(leadsMotorInfoList, "full_name"),
    [leadsMotorInfoList]
  );

  const mobileFilterOptions = useMemo(
    () => createFilterOptions(leadsMotorInfoList, "mobile"),
    [leadsMotorInfoList]
  );

  const emailFilterOptions = useMemo(
    () => createFilterOptions(leadsMotorInfoList, "email"),
    [leadsMotorInfoList]
  );

  const vehicleModelFilterOptions = useMemo(
    () => createFilterOptions(leadsMotorInfoList, "vehicle_model"),
    [leadsMotorInfoList]
  );

  const vehicleValueFilterOptions = useMemo(
    () => createFilterOptions(leadsMotorInfoList, "vehicle_value"),
    [leadsMotorInfoList]
  );

  const handleRefetch = useCallback(async () => {
    const toastId = "lead-motor-info-list-refetch-toast";

    toast.loading("Refetching...", { id: toastId });

    try {
      const { isSuccess } = await LeadsMotorInfoListRefetch();

      if (isSuccess) {
        toast.success("Fetched Successfully!", { id: toastId });
      } else {
        toast.error("Failed to fetch data.", { id: toastId });
      }
    } catch (error) {
      toast.error(`${error}: An error occurred.`, { id: toastId });
    }
  }, [LeadsMotorInfoListRefetch]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<LeadMotorInfoPayloadTypes>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Full Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullNameFilterOptions,
        filterPlaceholder: "Filter by full name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "mobile",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Mobile" />
      ),
      cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: mobileFilterOptions,
        filterPlaceholder: "Filter by mobile...",
      } as ColumnMeta,
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
        filterPlaceholder: "Filter by email...",
      } as ColumnMeta,
    },
    {
      id: "vehicle_make",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Make" />
      ),
      accessorFn: (row) => {
        if (!row.vehicle_make) {
          return "N/A";
        }
        const makeName = igisMakeListResponse?.payload.find((item) =>
          row.vehicle_make.includes(String(item.id))
        )?.make_name;

        return makeName || "N/A";
      },
      cell: ({ row }) => <div>{row.getValue("vehicle_make")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: makeNameFilterOptions,
        filterPlaceholder: "Filter by vehicle make...",
      } as ColumnMeta,
    },
    {
      id: "vehicle_submake",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Submake" />
      ),
      accessorFn: (row) => {
        if (!row.vehicle_submake) {
          return "N/A";
        }
        const subMakeName = igisSubMakeListResponse?.payload.find((item) =>
          row.vehicle_submake.includes(String(item.id))
        )?.sub_make_name;

        return subMakeName || "N/A";
      },
      cell: ({ row }) => <div>{row.getValue("vehicle_submake")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: subMakeNameFilterOptions,
        filterPlaceholder: "Filter by vehicle submake...",
      } as ColumnMeta,
    },
    {
      accessorKey: "vehicle_model",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Model" />
      ),
      cell: ({ row }) => <div>{row.getValue("vehicle_model")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: vehicleModelFilterOptions,
        filterPlaceholder: "Filter by vehicle model...",
      } as ColumnMeta,
    },
    {
      accessorKey: "vehicle_value",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Value" />
      ),
      accessorFn: (row) => row?.vehicle_value,
      cell: ({ row }) => {
        return (
          <div>{formatNumberCell(row.original?.vehicle_value || "N/A")}</div>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: vehicleValueFilterOptions,
        filterPlaceholder: "Filter by vehicle value ...",
      } as ColumnMeta,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Motor Info Status" />
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
        module: process.env.NEXT_PUBLIC_PATH_LEADMOTORINFO!,
        record_id: selectedRecordId!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "lead-motor-info-list",
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
        module: process.env.NEXT_PUBLIC_PATH_LEADMOTORINFO!,
        record_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "lead-motor-info-list",
              ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
            ],
          });
        },
      }
    );
  };

  // ======== RENDER LOGIC ========
  const isLoading =
    LeadsMotorInfoListLoading || igisMakeListLoading || igisSubMakeListLoading;
  const isError =
    LeadsMotorInfoListIsError || igisMakeListIsError || igisSubMakeListIsError;
  const onError =
    LeadsMotorInfoListError?.message ||
    igisMakeListError?.message ||
    igisSubMakeListError?.message;

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

    if (!leadsMotorInfoList || leadsMotorInfoList.length === 0) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return (
      <MotorInfoDatatable
        columns={columns}
        payload={leadsMotorInfoList || igisMakeList || igisSubMakeList}
        isRefetching={LeadsMotorInfoListIsRefetching}
        handleRefetch={handleRefetch}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Lead Motor Info List"
        datePicker={true}
        dateRange={dateRange}
        defaultDate={defaultRange}
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

export default MotorInfoList;
