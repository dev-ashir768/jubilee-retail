"use client";

import React, { useState } from "react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "../shadcn/dropzone";
import { cn } from "@/lib/utils";
import { FileIcon, UploadCloudIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { ExcelDataExpectedRow } from "@/types/uploadExcelTypes";
import { DATE_KEYS, NUMBER_KEYS, validateRow } from "@/utils/excelValidation";
import { createBulkOrderState } from "@/hooks/createBulkOrderState";
import { RiderTypes } from "@/types/createBulkOrder";

const ExcelUpload = () => {
  const { setJsonResult} = createBulkOrderState();
  const [error, setError] = useState<string | null>(null);

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setJsonResult(null);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        if (workbook.SheetNames.length > 1) {
          toast.warning(
            `Only first sheet "${workbook.SheetNames[0]}" processed. Ignoring others.`
          );
        }

        // Convert sheet to JSON
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet);

        // Filter empty rows
        jsonData = jsonData.filter((row) => Object.keys(row).length > 0);

        // Transform & coerce types
        const transformedData: Partial<ExcelDataExpectedRow>[] = jsonData.map(
          (row) => {
            const transformed: Partial<ExcelDataExpectedRow> = {};
            Object.keys(row).forEach((key) => {
              const newKey = key
                .trim()
                .replace(/\s+/g, "_")
                .toLowerCase() as keyof ExcelDataExpectedRow;
              let value = row[key];

              // Type coercion for numbers
              if (NUMBER_KEYS.includes(newKey)) {
                const num = Number(value);
                value = isNaN(num) ? undefined : num;
              }

              // Date parsing & formatting to YYYY-MM-DD
              if (DATE_KEYS.includes(newKey)) {
                let dateValue: Date | null = null;

                if (typeof value === "number") {
                  // Excel serial date (adjust for 1900-01-01 epoch)
                  const jsDate = new Date((value - 25569) * 86400 * 1000); // 25569 = offset to JS epoch
                  if (!isNaN(jsDate.getTime())) {
                    dateValue = jsDate;
                  }
                } else if (typeof value === "string") {
                  // Normalize common formats to YYYY-MM-DD
                  let normalized = value;
                  // Handle MM/DD/YYYY or DD/MM/YYYY → YYYY-MM-DD
                  const match = value.match(
                    /(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/
                  );
                  if (match) {
                    const [, monthOrDay, dayOrMonth, year] = match;
                    // Assume MM/DD if month > 12, else DD/MM (simple heuristic)
                    const month =
                      parseInt(monthOrDay) <= 12
                        ? parseInt(monthOrDay)
                        : parseInt(dayOrMonth);
                    const day =
                      parseInt(monthOrDay) <= 12
                        ? parseInt(dayOrMonth)
                        : parseInt(monthOrDay);
                    normalized = `${year}-${month
                      .toString()
                      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                  }
                  dateValue = new Date(normalized);
                }

                if (dateValue && !isNaN(dateValue.getTime())) {
                  value = dateValue.toISOString().split("T")[0]; // "2025-01-01"
                } else {
                  value = undefined; // Invalid → validation will catch
                }
              }

              if (value !== undefined) {
                transformed[newKey] = value;
              }
            });
            return transformed;
          }
        );

        // Validate each row (pass DATE_KEYS if needed for validateRow)
        const validationResults = transformedData.map((row, index) =>
          validateRow(row, index)
        );
        const allErrors = validationResults.flatMap((r) => r.errors);
        const validRows = validationResults
          .map((result, index) =>
            result.valid
              ? (transformedData[index] as ExcelDataExpectedRow)
              : null
          )
          .filter((row): row is ExcelDataExpectedRow => row !== null);

        if (allErrors.length > 0 || validRows.length === 0) {
          const errorMsg =
            allErrors.length > 0
              ? allErrors.join("\n")
              : "No valid data found in Excel.";
          setError(errorMsg);
          const shortError = `Core validation errors (${allErrors.length} rows). Check details.`;
          toast.error(shortError);
          return { status: "error", error: "Validation failed" };
        }

        const transformedJsonData = validRows.map((row) => {
          const policy_detail: any[] = [];

          // Add spouses (spouse, spouse1, spouse2, spouse3)
          for (let i = 0; i <= 3; i++) {
            const suffix = i === 0 ? "" : i;
            const nameKey =
              `spouse${suffix}_name` as keyof ExcelDataExpectedRow;
            if (row[nameKey]) {
              policy_detail.push({
                name: row[nameKey]!, // Non-null assertion as we checked it
                type: `spouse${suffix}`, // <-- Use the dynamic key (e.g., "spouse", "spouse1")
                relation:
                  row[
                    `spouse${suffix}_relationship` as keyof ExcelDataExpectedRow
                  ] || "Spouse",
                cnic:
                  row[`spouse${suffix}_cnic` as keyof ExcelDataExpectedRow] ||
                  null,
                cnic_issue_date:
                  row[
                    `spouse${suffix}_cnic_issue_date` as keyof ExcelDataExpectedRow
                  ] || null,
                dob:
                  row[`spouse${suffix}_dob` as keyof ExcelDataExpectedRow] ||
                  null,
                gender:
                  row[`spouse${suffix}_gender` as keyof ExcelDataExpectedRow] ||
                  null,
              });
            }
          }

          // Add kids (kid1 to kid8)
          for (let i = 1; i <= 8; i++) {
            const nameKey = `kid${i}_name` as keyof ExcelDataExpectedRow;
            if (row[nameKey]) {
              policy_detail.push({
                name: row[nameKey]!, // Non-null assertion
                type: `kid${i}`, // <-- Use the dynamic key (e.g., "kid1", "kid2")
                relation:
                  row[`kid${i}_relationship` as keyof ExcelDataExpectedRow] ||
                  "Child",
                cnic: row[`kid${i}_cnic` as keyof ExcelDataExpectedRow] || null,
                cnic_issue_date:
                  row[
                    `kid${i}_cnic_issue_date` as keyof ExcelDataExpectedRow
                  ] || null,
                dob: row[`kid${i}_dob` as keyof ExcelDataExpectedRow] || null,
                gender:
                  row[`kid${i}_gender` as keyof ExcelDataExpectedRow] || null,
              });
            }
          }

          // Add riders (rider1, rider2)
          const rider: RiderTypes[] = [];
          if (row.rider1_covered) {
            rider.push({
              name: row.rider1_covered,
              sum_insured: (row.rider1_sum_assured || 0).toString(),
            });
          }
          if (row.rider2_covered) {
            rider.push({
              name: row.rider2_covered,
              sum_insured: (row.rider2_sum_assured || 0).toString(),
            });
          }

          // Assemble the final nested object
          return {
            api_user_name: row.partner_name,
            payment_mode_code: row.payment_mode,
            child_sku: row.plan,
            order_code: row.order_no,
            customer_name: row.client_name,
            customer_cnic: row.client_cnic,
            customer_dob: row.client_dob,
            customer_email: row.client_email,
            cnic_issue_date: row.client_cnic_issue_date,
            customer_contact: row.client_contact_no,
            customer_address: row.address,
            customer_gender: row.gender,
            customer_occupation: row.client_occupation,
            start_date: row.start_date,
            expiry_date: row.expiry_date,
            issue_date: new Date().toISOString().split("T")[0],
            received_premium: (row.premium || 0).toString(),
            policy_detail: policy_detail,
            rider: rider,
          };
        });

        setJsonResult(transformedJsonData);

        toast.success(`Success! ${validRows.length} valid rows processed.`);

        return {
          status: "success",
          result: `${workbook.SheetNames.length} sheet(s) → ${validRows.length} valid rows`,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process Excel.";
        setError(errorMessage);
        toast.error(errorMessage);
        return { status: "error", error: "Conversion failed" };
      }
    },
    validation: {
      accept: {
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const fileName = dropzone.fileStatuses[0]?.fileName;
  const isPending = dropzone.fileStatuses[0]?.status === "pending";
  const fileStatus = dropzone.fileStatuses[0]?.status;

  return (
    <>
      <Dropzone {...dropzone}>
        <div className="flex justify-between">
          <DropzoneMessage />
        </div>
        <DropZoneArea
          className={cn(
            "border-dashed min-h-[150px] justify-center",
            isPending && "animate-pulse"
          )}
        >
          <DropzoneTrigger className="flex h-full w-full flex-col items-center justify-center gap-3 bg-transparent px-6 py-10 text-sm">
            {fileName ? (
              <>
                <FileIcon className="stroke-gray-500 h-10 w-10" />
                <div className="flex flex-col gap-1 text-center font-semibold">
                  <p>{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isPending
                      ? "Uploading..."
                      : fileStatus === "success"
                      ? "File converted to JSON!"
                      : fileStatus === "error"
                      ? "Conversion failed. Please try again."
                      : "File selected. Click to replace."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <UploadCloudIcon className="stroke-gray-500 h-10 w-10" />
                <div className="flex flex-col gap-1 text-center font-semibold">
                  <p>Upload your Excel file</p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to select (.xls, .xlsx, max 10MB)
                  </p>
                </div>
              </>
            )}
          </DropzoneTrigger>
        </DropZoneArea>
      </Dropzone>


      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="font-semibold text-red-800 mb-2">
            Core Validation Errors ({(error.match(/\n/g) || []).length + 1}{" "}
            lines):
          </p>
          <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded text-red-900">
            {error}
          </pre>
        </div>
      )}
    </>
  );
};

export default ExcelUpload;
