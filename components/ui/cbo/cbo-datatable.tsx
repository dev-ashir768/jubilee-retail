import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { CboPayloadType } from "@/types/cboTypes";

interface CboDatatableProps {
  columns: ColumnDef<CboPayloadType>[];
  payload: CboPayloadType[] | undefined;
  isRefetching: boolean;
  handleRefetch: () => void;
}

const CboDatatable: React.FC<CboDatatableProps> = ({
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
        title="List of all cbo in the system"
      />
    </>
  );
};

export default CboDatatable;
