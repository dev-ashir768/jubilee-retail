"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import LoadingState from "../../foundations/loading-state";
import Error from "../../foundations/error";
import Empty from "../../foundations/empty";
import SubNav from "../../foundations/sub-nav";
import ManageDatatable from "./manage-datatable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { Button } from "../../shadcn/button";
import { Edit, EyeIcon, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import DatatableColumnHeader from "../../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../../shadcn/badge";
import {
  MotorQuotePayloadTypes,
  MotorQuoteResponseTypes,
} from "@/types/motorQuote";
import { fetchMotorQuoteList } from "@/helperFunctions/motorQuoteFunctions";
import { createFilterOptions } from "@/utils/filterOptions";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import MotorQuotesFilters from "../../filters/motor-quotes";
import { motorQuotesFilterState } from "@/hooks/motorQuotesFilterState";

const MotorQuoteList = () => {
  // ======== CONSTANTS & HOOKS ========
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const defaultDaysBack = 600;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filterValue } =
    motorQuotesFilterState();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), defaultDaysBack),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // ======== HANDLE STATUS UPDATE HIERARCHY ========
  const handleStatus = (id: number, status: string) => {
    updateQuoteStatusMutation.mutate({ motor_quote_id: id, status });
  };

  const renderMenuItems = (id: number, status: string) => {
    switch (status) {
      case "pending":
        return (
          <>
            <DropdownMenuItem onClick={() => handleStatus(id, "cancelled")}>
              Cancelled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatus(id, "approved")}>
              Approved
            </DropdownMenuItem>
          </>
        );
      case "approved":
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
    data: motorQuoteListResponse,
    isLoading: motorQuoteListLoading,
    isError: motorQuoteListIsError,
    error: motorQuoteListError,
  } = useQuery<MotorQuoteResponseTypes | null>({
    queryKey: [
      "motor-quote-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
      ...(filterValue ? [filterValue] : [])
    ],
    queryFn: () =>
      fetchMotorQuoteList({
        startDate,
        endDate,
        status: filterValue!
      }),
  });

  // ======== PAYLOADS DATA ========
  const motorQuoteList = useMemo(
    () => motorQuoteListResponse?.payload || [],
    [motorQuoteListResponse]
  );

  // ======== MUTATION ========
  const updateQuoteStatusMutation = useMutation<
    MotorQuoteResponseTypes,
    AxiosError<MotorQuoteResponseTypes>,
    { motor_quote_id: number; status: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/motor-quotes/status",
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
      console.log("Update status motor quote mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["motor-quote-list"] });
    },
  });

  // ======== FILTER OPTIONS ========
  const nameFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "name"),
    [motorQuoteList]
  );
  const policyTypeFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "policy_type"),
    [motorQuoteList]
  );
  const quoteIdFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "quote_id"),
    [motorQuoteList]
  );
  const mobileFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "mobile"),
    [motorQuoteList]
  );
  const cityIdFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "city_id"),
    [motorQuoteList]
  );
  const premiumValueFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "premium_value"),
    [motorQuoteList]
  );
  const rateFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "rate"),
    [motorQuoteList]
  );
  const vehicleMakeFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "vehicle_make"),
    [motorQuoteList]
  );
  const vehicleSubmakeFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "vehicle_submake"),
    [motorQuoteList]
  );
  const vehicleValueFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "vehicle_value"),
    [motorQuoteList]
  );
  const vehicleModelFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "vehicle_model"),
    [motorQuoteList]
  );
  const regNoFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "reg_no"),
    [motorQuoteList]
  );
  const engineNoFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "engine_no"),
    [motorQuoteList]
  );
  const chassisNoFilterOptions = useMemo(
    () => createFilterOptions(motorQuoteList, "chassis_no"),
    [motorQuoteList]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<MotorQuotePayloadTypes>[] = [
    {
      id: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      accessorFn: (row) => row.name || "N/A",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter by name...",
      } as ColumnMeta,
    },
    {
      id: "policy_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Policy Type" />
      ),
      accessorFn: (row) => row.policy_type || "N/A",
      cell: ({ row }) => <div>{row.getValue("policy_type")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: policyTypeFilterOptions,
        filterPlaceholder: "Filter by policy type...",
      } as ColumnMeta,
    },
    {
      id: "quote_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Quote ID" />
      ),
      accessorFn: (row) => row.quote_id || "N/A",
      cell: ({ row }) => <div>{row.getValue("quote_id")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: quoteIdFilterOptions,
        filterPlaceholder: "Filter by quote ID...",
      } as ColumnMeta,
    },
    {
      id: "mobile",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Mobile" />
      ),
      accessorFn: (row) => row.mobile || "N/A",
      cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: mobileFilterOptions,
        filterPlaceholder: "Filter by policy type...",
      } as ColumnMeta,
    },
    {
      id: "city_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="City ID" />
      ),
      accessorFn: (row) => row.city_id || "N/A",
      cell: ({ row }) => <div>{row.getValue("city_id")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: cityIdFilterOptions,
        filterPlaceholder: "Filter by city ID...",
      } as ColumnMeta,
    },
    {
      id: "premium_value",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Premium Value" />
      ),
      accessorFn: (row) => row.premium_value || "N/A",
      cell: ({ row }) => <div>{row.getValue("premium_value")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: premiumValueFilterOptions,
        filterPlaceholder: "Filter by premium value...",
      } as ColumnMeta,
    },
    {
      id: "rate",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Rate" />
      ),
      accessorFn: (row) => row.rate || "N/A",
      cell: ({ row }) => <div>{row.getValue("rate")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: rateFilterOptions,
        filterPlaceholder: "Filter by rate...",
      } as ColumnMeta,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Quote Status" />
      ),
      cell: ({ row }) => {
        const { id, status } = row.original;
        const currentStatus = status as string;
        const isLocked = ["approved", "cancelled"].includes(currentStatus);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLocked}>
              <Badge
                variant={currentStatus as "approved" | "pending" | "cancelled"}
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
      id: "vehicle_make",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Make" />
      ),
      accessorFn: (row) => row.vehicle_make || "N/A",
      cell: ({ row }) => <div>{row.getValue("vehicle_make")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: vehicleMakeFilterOptions,
        filterPlaceholder: "Filter by vehicle make...",
      } as ColumnMeta,
    },
    {
      id: "vehicle_submake",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Submake" />
      ),
      accessorFn: (row) => row.vehicle_submake || "N/A",
      cell: ({ row }) => <div>{row.getValue("vehicle_submake")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: vehicleSubmakeFilterOptions,
        filterPlaceholder: "Filter by vehicle make...",
      } as ColumnMeta,
    },
    {
      id: "vehicle_value",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Value" />
      ),
      accessorFn: (row) => row.vehicle_value || "N/A",
      cell: ({ row }) => <div>{row.getValue("vehicle_value")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: vehicleValueFilterOptions,
        filterPlaceholder: "Filter by vehicle make...",
      } as ColumnMeta,
    },
    {
      id: "vehicle_model",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Vehicle Model" />
      ),
      accessorFn: (row) => row.vehicle_model || "N/A",
      cell: ({ row }) => <div>{row.getValue("vehicle_model")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: vehicleModelFilterOptions,
        filterPlaceholder: "Filter by vehicle model...",
      } as ColumnMeta,
    },
    {
      id: "reg_no",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Registration No" />
      ),
      accessorFn: (row) => row.reg_no || "N/A",
      cell: ({ row }) => <div>{row.getValue("reg_no")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: regNoFilterOptions,
        filterPlaceholder: "Filter by reg no...",
      } as ColumnMeta,
    },
    {
      id: "engine_no",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Engine No" />
      ),
      accessorFn: (row) => row.engine_no || "N/A",
      cell: ({ row }) => <div>{row.getValue("engine_no")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: engineNoFilterOptions,
        filterPlaceholder: "Filter by engine no...",
      } as ColumnMeta,
    },
    {
      id: "chassis_no",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Chassis No" />
      ),
      accessorFn: (row) => row.chassis_no || "N/A",
      cell: ({ row }) => <div>{row.getValue("chassis_no")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: chassisNoFilterOptions,
        filterPlaceholder: "Filter by chassis no...",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        const isAssigned = record.agent_id || record.branch_id;

        const actionText = isAssigned ? "View" : "Edit";
        const ActionIcon = isAssigned ? EyeIcon : Edit;

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
                <DropdownMenuItem>
                  <ActionIcon className="mr-2 h-4 w-4" />
                  {actionText}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ======== RENDER LOGIC ========
  const isLoading = motorQuoteListLoading;
  const isError = motorQuoteListIsError;
  const onError = motorQuoteListError?.message;

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

    if (!motorQuoteList || motorQuoteList.length === 0) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return <ManageDatatable columns={columns} payload={motorQuoteList} />;
  };

  return (
    <>
      <SubNav
        title="Manage Motor Quote List"
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
        defaultDaysBack={defaultDaysBack}
        filter={true}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {renderPageContent()}

      <MotorQuotesFilters
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />
    </>
  );
};

export default MotorQuoteList;
