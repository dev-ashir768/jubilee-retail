"use client";

import { fetchAgentList } from "@/helperFunctions/agentFunction";
import useAgentIdStore from "@/hooks/useAgentIdStore";
import { AgentPayloadTypes, AgentResponseTypes } from "@/types/agentTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
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
import { DevelopmentOfficerResponseTypes } from "@/types/developmentOfficerTypes";
import { fetchAllDevelopmentOfficerList } from "@/helperFunctions/developmentOfficerFunction";
import AgentDatatable from "./agent-datatable";
import LoadingState from "../foundations/loading-state";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

const AgentList = () => {
  // Constants
  const ADD_ROUTES = "/agents-dos/add-agent";
  const { setAgentId } = useAgentIdStore();
  const router = useRouter();
  const pathname = usePathname();
  const defaultDaysBack = 366;
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), defaultDaysBack),
    to: new Date(),
  });
  const startDate = dateRange?.from
    ? format(dateRange?.from, "yyyy-MM-dd")
    : "";
  const endDate = dateRange?.to ? format(dateRange?.to, "yyyy-MM-dd") : "";

  // Fetch development officer list data using react-query
  const {
    data: developmentOfficerListResponse,
    isLoading: developmentOfficerListLoading,
    isError: developmentOfficerListIsError,
    error: developmentOfficerListError,
  } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ["all-development-officers-list"],
    queryFn: fetchAllDevelopmentOfficerList,
  });

  // Create a development officer ID to name mapping
  const developmentOfficerNameMap = useMemo(() => {
    const map = new Map<number, string>();
    developmentOfficerListResponse?.payload.forEach((item) => {
      map.set(item.id, item.name);
    });
    return map;
  }, [developmentOfficerListResponse]);

  // Fetch agent list data using react-query
  const {
    data: agentListResponse,
    isLoading: agentListLoading,
    isError: agentListIsError,
    error: agentListError,
  } = useQuery<AgentResponseTypes | null>({
    queryKey: ["agents-list", ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),],
    queryFn: ()=> fetchAgentList({
      startDate,
      endDate
    }),
  });

  // Column filter options
  const nameFilterOptions = useMemo(() => {
    const allNames = agentListResponse?.payload?.map((item) => item.name) || [];
    const uniqueNames = Array.from(
      new Set(allNames.filter((name) => name != null))
    );
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [agentListResponse]);

  const igisCodeFilterOptions = useMemo(() => {
    const allIgisCodes =
      agentListResponse?.payload?.map((item) => item.igis_code) || [];
    const uniqueIgisCodes = Array.from(
      new Set(allIgisCodes.filter((igisCode) => igisCode != null))
    );
    return uniqueIgisCodes.map((igis_code) => ({
      label: igis_code,
      value: igis_code,
    }));
  }, [agentListResponse]);

  const igisAgentCodeFilterOptions = useMemo(() => {
    const allIgisAgentCodes =
      agentListResponse?.payload?.map((item) => item.igis_agent_code) || [];
    const uniqueIgisAgentCodes = Array.from(
      new Set(
        allIgisAgentCodes.filter((igisAgentCode) => igisAgentCode != null)
      )
    );
    return uniqueIgisAgentCodes.map((igis_agent_code) => ({
      label: igis_agent_code,
      value: igis_agent_code,
    }));
  }, [agentListResponse]);

  const developmentOfficerIdFilterOptions = useMemo(() => {
    const allDevelopmentOfficerIds =
      agentListResponse?.payload?.map((item) =>
        item.development_officer_id.toString()
      ) || [];
    const uniqueDevelopmentOfficerIds = Array.from(
      new Set(allDevelopmentOfficerIds)
    );
    return uniqueDevelopmentOfficerIds.map((development_officer_id) => ({
      label: developmentOfficerNameMap.get(+development_officer_id),
      value: developmentOfficerNameMap.get(+development_officer_id),
    }));
  }, [agentListResponse, developmentOfficerNameMap]);

  // Define columns for the data table
  const columns: ColumnDef<AgentPayloadTypes>[] = [
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
      accessorKey: "igis_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="IGIS Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("igis_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisCodeFilterOptions,
        filterPlaceholder: "Filter IGIS code...",
      } as ColumnMeta,
    },
    {
      accessorKey: "igis_agent_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="IGIS Agent Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("igis_agent_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisAgentCodeFilterOptions,
        filterPlaceholder: "Filter IGIS agent code...",
      } as ColumnMeta,
    },
    {
      accessorKey: "development_officer_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Development Officer ID" />
      ),
      accessorFn: (row) =>
        developmentOfficerNameMap.get(row.development_officer_id) ||
        row.development_officer_id,
      cell: ({ row }) => <div>{row.getValue("development_officer_id")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: developmentOfficerIdFilterOptions,
        filterPlaceholder: "Filter development officer ID...",
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
          <Badge
            className="justify-center py-1 min-w-[50px] w-[70px]"
            variant={status === "active" ? "success" : "danger"}
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
                <DropdownMenuItem onClick={() => setAgentId(record.id)} asChild>
                  <Link href="/agents-dos/edit-agents">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
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

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // ======== RENDER LOGIC ========
  const isLoading = agentListLoading || developmentOfficerListLoading;
  const isError = agentListIsError || developmentOfficerListIsError;
  const onError =
    agentListError?.message || developmentOfficerListError?.message;

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

    if (!agentListResponse?.payload || agentListResponse?.payload.length === 0) {
      return <Empty title="Not Found" description="Not Found" />;
    }

    return (
      <AgentDatatable
        columns={columns}
        payload={agentListResponse?.payload || []}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Agent List"
        addBtnTitle="Add Agent"
        urlPath={ADD_ROUTES}
        datePicker={true}
        dateRange={dateRange}
        setDateRange={setDateRange}
        defaultDaysBack={defaultDaysBack}
      />

      {renderPageContent()}
    </>
  );
};

export default AgentList;
