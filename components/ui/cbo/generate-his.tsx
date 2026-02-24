import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "../shadcn/button";
import { Loader2 } from "lucide-react";
import { DateRangeCalendar } from "../foundations/date-range-calender";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { GenerateHISResponseTypes } from "@/types/generateHisType";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";

interface GenerateHisProps {
  isExportZipOpen: boolean;
  setIsExportZipOpen: (isExportZipOpen: boolean) => void;
}

const GenerateHis: React.FC<GenerateHisProps> = ({
  isExportZipOpen,
  setIsExportZipOpen,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(
    dateRange,
  );
  const [fileType, setFileType] = useState<string>("");

  // ======== MUTATION ========
  const generateHISMutation = useMutation<
    Blob,
    AxiosError<GenerateHISResponseTypes>,
    { option: string; date: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: `/orders/generate-his`,
        data: { option: record.option, date: record.date },
        isServer: true,
        responseType: "blob",
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Generate HIS mutation error", err);
    },
    onSuccess: (blobData: Blob) => {
      const url = URL.createObjectURL(blobData);

      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-his-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);

      // Trigger download
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Generated HIS downloaded successfully");

      setIsExportZipOpen(false);
    },
  });

  // ======== HANDLERS ========
  const handleApply = useCallback(() => {
    if (localDateRange?.from && localDateRange?.to && fileType) {
      const formattedDate = `${format(
        localDateRange.from,
        "yyyy-MM-dd",
      )} to ${format(localDateRange.to, "yyyy-MM-dd")}`;
      const option = fileType;
      generateHISMutation.mutate({ option, date: formattedDate });
      setDateRange(localDateRange);
    } else {
      toast.error("Please select a complete date range and file type.");
    }
  }, [localDateRange, fileType, generateHISMutation]);

  const handleCancel = useCallback(() => {
    setLocalDateRange(dateRange);
    setFileType("");
    setIsExportZipOpen(false);
  }, [dateRange, setIsExportZipOpen]);

  const handleReset = useCallback(() => {
    const defaultDateRange = {
      from: startOfMonth(new Date()),
      to: new Date(),
    };
    setDateRange(defaultDateRange);
    setLocalDateRange(defaultDateRange);
    setFileType("");
  }, [setDateRange]);

  return (
    <>
      <Dialog open={isExportZipOpen} onOpenChange={setIsExportZipOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[660px] gap-6">
          <DialogHeader>
            <DialogTitle>Export Zip</DialogTitle>
            <DialogDescription>
              Select your desired date to export zip.
            </DialogDescription>
          </DialogHeader>
          <div>
            <DateRangeCalendar date={localDateRange} />

            <div className="mt-4">
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select File Type" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value=".xlsx">Excel File</SelectItem> */}
                  <SelectItem value=".txt">Text File</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="min-w-[79px] cursor-pointer"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="min-w-[79px] cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="min-w-[79px] cursor-pointer"
              disabled={
                generateHISMutation.isPending ||
                !localDateRange?.from ||
                !localDateRange?.to ||
                !fileType
              }
            >
              {generateHISMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateHis;
