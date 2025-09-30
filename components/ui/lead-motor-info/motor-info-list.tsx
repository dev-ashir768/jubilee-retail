"use client";

import React, { useEffect, useMemo } from "react";
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

const MotorInfoList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/leads/lead-motor-info";
  const queryClient = useQueryClient();
  const router = useRouter();

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
        null;
    }
  };

  // ======== DATA FETCHING ========
  const {
    data: LeadsMotorInfoListResponse,
    isLoading: LeadsMotorInfoListLoading,
    error: LeadsMotorInfoListError,
    isError: LeadsMotorInfoListIsError,
  } = useQuery<LeadMotorInfoResponseTypes | null>({
    queryKey: ["lead-motor-info-list"],
    queryFn: fetchLeadsMotorInfoList,
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
      queryClient.invalidateQueries({ queryKey: ["lead-motor-info-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // ======== PAYLOADS DATA ========
  const leadsMotorInfoList = useMemo(
    () => LeadsMotorInfoListResponse?.payload || [],
    [LeadsMotorInfoListResponse]
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
      cell: ({ row }) => {
        return <div>{row.getValue("vehicle_value")}</div>;
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
        <DatatableColumnHeader column={column} title="Vehicle Value" />
      ),
      cell: ({ row }) => {
        const { status, id } = row.original;
        const currentStatus = status as string;
        const isLocked = ["interested", "not_interested", "cancelled"].includes(
          currentStatus
        );

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLocked} className="disabled:cursor-not-allowed">
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
        return (
          <Badge variant={status === "active" ? "danger" : "danger"}>
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

  // ======== RENDER LOGIC ========
  const isLoading = LeadsMotorInfoListLoading;
  const isError = LeadsMotorInfoListIsError;
  const onError = LeadsMotorInfoListError?.message;

  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights && rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav title="Lead Motor Info List" />

      <MotorInfoDatatable columns={columns} payload={leadsMotorInfoList} />
    </>
  );
};

export default MotorInfoList;
