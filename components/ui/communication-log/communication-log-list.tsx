"use client";

import {
  CommunicationLogsPayloadType,
  CommunicationLogsResponseType,
  RepushCommunicationLogsResponseType,
} from "@/types/communicationLogsTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import CommunicationLogDatatable from "./communication-log-datatable";
import { getRights } from "@/utils/getRights";
import { fetchCommunicationLogsList } from "@/helperFunctions/communicationLogsFunction";
import { ColumnDef } from "@tanstack/react-table";
import SubNav from "../foundations/sub-nav";
import Error from "../foundations/error";
import { format, formatDate, startOfMonth } from "date-fns";
import { Badge } from "../shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import {
  FileText,
  Mail,
  MoreHorizontal,
  Paperclip,
  RefreshCcwDot,
} from "lucide-react";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { DateRange } from "react-day-picker";

const CommunicationLogList = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/communication-log";
  const router = useRouter();
  const queryClient = useQueryClient();

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

  // ======== STATE ========
  const [selectedRecord, setSelectedRecord] =
    useState<CommunicationLogsPayloadType | null>(null);
  const [dialogType, setDialogType] = useState<
    "message" | "htmlContent" | "attachments" | null
  >(null);

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
    refetch: communicationlogsListRefetch,
    isRefetching: communicationlogsListIsRefetching,
  } = useQuery<CommunicationLogsResponseType | null>({
    queryKey: [
      "communication-logs-list",
      ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
    ],
    queryFn: () => fetchCommunicationLogsList({ startDate, endDate }),
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

  // ======== HANDLERS ========
  const handleOpenDialog = (
    record: CommunicationLogsPayloadType,
    type: "message" | "htmlContent" | "attachments"
  ) => {
    setSelectedRecord(record);
    setDialogType(type);
  };

  const handleCloseDialog = () => {
    setSelectedRecord(null);
    setDialogType(null);
  };

  const handleRefetch = useCallback(async () => {
    const toastId = "order-list-refetch-toast";

    toast.loading("Refetching...", { id: toastId });

    try {
      const { isSuccess } = await communicationlogsListRefetch();

      if (isSuccess) {
        toast.success("Fetched Successfully!", { id: toastId });
      } else {
        toast.error("Failed to fetch data.", { id: toastId });
      }
    } catch (error) {
      toast.error(`${error}: An error occurred.`, { id: toastId });
    }
  }, [communicationlogsListRefetch]);

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<CommunicationLogsPayloadType>[] = [
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
      accessorKey: "type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.type === "email" ? "interested" : "waiting"}
        >
          {row.original.type}
        </Badge>
      ),
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        const hasAttachments =
          record.params?.attachments && record.params.attachments.length > 0;
        const hasMessage = !!record.message;
        const hasHtmlContent = !!record.htmlContent;

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
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      useRepushMutation.mutate({
                        communication_log_id: record.id,
                      });
                    }}
                  >
                    <RefreshCcwDot className="h-4 w-4 mr-2" />
                    Repush
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                disabled={!hasMessage}
                onClick={() =>
                  hasMessage && handleOpenDialog(record, "message")
                }
              >
                <Mail className="h-4 w-4 mr-2" />
                View Message
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={!hasHtmlContent}
                onClick={() =>
                  hasHtmlContent && handleOpenDialog(record, "htmlContent")
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                View Email Content
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={!hasAttachments}
                onClick={() =>
                  hasAttachments && handleOpenDialog(record, "attachments")
                }
              >
                <Paperclip className="h-4 w-4 mr-2" />
                View Attachments ({record.params?.attachments?.length || 0})
              </DropdownMenuItem>
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
      communicationlogsListResponse.payload.length === 0
    ) {
      return (
        <Empty title="Not Found" description="No communication logs found" />
      );
    }

    return (
      <CommunicationLogDatatable
        columns={columns}
        payload={communicationlogsListResponse?.payload}
        isRefetching={communicationlogsListIsRefetching}
        handleRefetch={handleRefetch}
      />
    );
  };

  return (
    <>
      <SubNav
        title="Communication Logs List"
        addBtnTitle="Add Communication Log"
        datePicker={true}
        dateRange={dateRange}
        defaultDate={defaultRange}
        setDateRange={setDateRange}
      />

      {renderPageContent()}

      {/* Message Dialog */}
      <Dialog
        open={dialogType === "message"}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto">
            <p className="whitespace-pre-wrap">{selectedRecord?.message}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* HTML Content Dialog */}
      <Dialog
        open={dialogType === "htmlContent"}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>Email Content</DialogTitle>
          </DialogHeader>
          <div
            className="max-h-[500px] overflow-y-auto"
            dangerouslySetInnerHTML={{
              __html: selectedRecord?.htmlContent || "",
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Attachments Dialog */}
      <Dialog
        open={dialogType === "attachments"}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Attachments</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {selectedRecord?.params?.attachments?.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <span className="text-sm truncate flex-1">
                  {attachment.filename}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(attachment.path, "_blank")}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunicationLogList;
