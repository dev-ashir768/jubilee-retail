import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CommunicationLogsPayloadType } from "@/types/communicationLogsTypes";

interface CommunicationLogsDatatableProps {
  columns: ColumnDef<CommunicationLogsPayloadType>[];
  payload: CommunicationLogsPayloadType[];
  isRefetching: boolean;
  handleRefetch: () => void;
}
const CommunicationLogsDatatable: React.FC<CommunicationLogsDatatableProps> = ({
  columns,
  payload,
  isRefetching,
  handleRefetch,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload!}
        showRefetch={true}
        isRefetching={isRefetching}
        handleRefetch={handleRefetch}
        title="List of all call us data in the system"
      />
    </>
  );
};

export default CommunicationLogsDatatable;
