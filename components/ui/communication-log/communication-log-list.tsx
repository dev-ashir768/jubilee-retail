"use client";

import {
  CommunicationLogsDataType,
  CommunicationLogsResponseType,
} from "@/types/communicationLogsTypes";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import CommunicationLogDatatable from "./communication-log-datatable";
import { getRights } from "@/utils/getRights";
import { fetchAllCommunicationLogsList } from "@/helperFunctions/communicationLogsFunction";
import { ColumnDef } from "@tanstack/react-table";
import SubNav from "../foundations/sub-nav";
import Error from "../foundations/error";
import { formatDate } from "date-fns";
import { Badge } from "../shadcn/badge";

const CommunicationLogList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/communication-logs/";
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: communicationlogsListResponse,
    isLoading: communicationlogsListLoading,
    isError: communicationlogsListIsError,
    error: communicationlogsListError,
  } = useQuery<CommunicationLogsResponseType | null>({
    queryKey: ["communication-logs-list"],
    queryFn: fetchAllCommunicationLogsList,
  });
  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<CommunicationLogsDataType>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.original.type}</div>,
    },
    {
      accessorKey: "recipient",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Recipient" />
      ),
      cell: ({ row }) => <div>{row.original.recipient}</div>,
    },
    {
      accessorKey: "subject",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Subject" />
      ),
      cell: ({ row }) => <div>{row.original.subject}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      accessorFn: (row) => (row.status === "sent" ? "sent" : "failed"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "sent" ? "success" : "danger"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "retried_count",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Retried Count" />
      ),
      cell: ({ row }) => <div>{row.original.retried_count}</div>,
    },
    {
      accessorKey: "last_attempt_at",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Last Attempt at" />
      ),
      cell: ({ row }) => (
        <div>{formatDate(row.original.last_attempt_at, "dd, MMM yyyy")}</div>
      ),
    },
    {
      accessorKey: "next_retry_at",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Next Retry at" />
      ),
      cell: ({ row }) => (
        <div>{formatDate(row.original.next_retry_at!, "dd, MMM yyyy")}</div>
      ),
    },
    {
      id: "otptype",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="OTP Type" />
      ),
      accessorFn: (row) => {
        return row.response_data?.data?.data?.[0]?.otptype ?? null;
      },
      cell: ({ getValue }) => {
        const value = getValue<string | null>();
        return <div>{value || "-"}</div>;
      },
    },
    {
      id: "messageid",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Message ID" />
      ),
      accessorFn: (row) => {
        return row.response_data?.data?.data?.[0]?.messageid ?? null;
      },
      cell: ({ getValue }) => {
        const value = getValue<string | null>();
        return <div>{value || "-"}</div>;
      },
    },
    {
      id: "originator",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Originator" />
      ),
      accessorFn: (row) => {
        return row.response_data?.data?.data?.[0]?.originator ?? null;
      },
      cell: ({ getValue }) => {
        const value = getValue<string | null>();
        return <div>{value || "-"}</div>;
      },
    },
    {
      id: "statuscode",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status Code" />
      ),
      accessorFn: (row) => {
        return row.response_data?.data?.data?.[0]?.statuscode ?? null;
      },
      cell: ({ getValue }) => {
        const value = getValue<string | null>();
        return <div>{value || "-"}</div>;
      },
    },
  ];

  // ======== RENDER LOGIC ========
  const isLoading = communicationlogsListLoading;
  const isError = communicationlogsListIsError;
  const onError = communicationlogsListError?.message;

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

    if (
      !communicationlogsListResponse?.payload ||
      communicationlogsListResponse.payload[0].data.length === 0
    ) {
      return (
        <Empty title="Not Found" description="No communication logs found" />
      );
    }

    return (
      <CommunicationLogDatatable
        columns={columns}
        payload={communicationlogsListResponse?.payload[0]?.data}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Communication Logs List"
        addBtnTitle="Add Communication Log"
      />

      {renderPageContent()}
    </>
  );
};

export default CommunicationLogList;
