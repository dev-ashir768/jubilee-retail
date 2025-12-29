"use client";

import {
  CommunicationLogsDataType,
  CommunicationLogsResponseType,
  RepushCommunicationLogsResponseType,
} from "@/types/communicationLogsTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { MoreHorizontal, RefreshCcwDot } from "lucide-react";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";

const CommunicationLogList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/communication-log";
  const router = useRouter();
  const queryClient = useQueryClient();

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

  // ======== MUTATIONS ========
  const useRepushMutation = useMutation<
    RepushCommunicationLogsResponseType,
    AxiosError<RepushCommunicationLogsResponseType>,
    { communication_log_id: number }
  >({
    mutationFn: ({ communication_log_id }) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/communication-logs/repush",
        data: { communication_log_id },
        isServer: true,
      });
    },
    onMutate: () => {
      toast.loading("Repushing...", { id: "repushing" });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Repush mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      queryClient.invalidateQueries({ queryKey: ["communication-logs-list"] });
      toast.dismiss("repushing");
      toast.success(message);
    },
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
    {
      id: "statusmessage",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status Message" />
      ),
      accessorFn: (row) => {
        return row.response_data?.data?.data?.[0]?.statusmessage ?? null;
      },
      cell: ({ getValue }) => {
        const value = getValue<string | null>();
        return <div>{value || "-"}</div>;
      },
    },
    {
      id: "attachments",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Attachments" />
      ),
      accessorFn: (row) => row.params?.attachments ?? [],
      cell: ({ row }) => {
        const attachments = row.original.params?.attachments;
        if (!attachments || attachments.length === 0) {
          return <div>-</div>;
        }
        return (
          <div className="flex flex-col items-start justify-start">
            {attachments.map((attachment, index) => (
              <Button
                key={index}
                variant="link"
                onClick={() => window.open(attachment.path, "_blank")}
                rel="noopener noreferrer"
                className="text-xs"
              >
                {attachment.filename}
              </Button>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "htmlContent",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Email Content" />
      ),
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            {row.original.htmlContent ? (
              <Button variant="link">View content</Button>
            ) : (
              <Button variant="link" disabled>
                View content
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[760px] gap-6">
            <DialogHeader>
              <DialogTitle>Email Content</DialogTitle>
            </DialogHeader>
            <div
              dangerouslySetInnerHTML={{
                __html: row.original.htmlContent || "",
              }}
            />
          </DialogContent>
        </Dialog>
      ),
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
              {rights?.can_edit === "1" && (
                <DropdownMenuItem
                  onClick={() => {
                    useRepushMutation.mutate({
                      communication_log_id: record.id,
                    });
                  }}
                >
                  <RefreshCcwDot className="h-4 w-4 mr-1" />
                  Repush
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
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
