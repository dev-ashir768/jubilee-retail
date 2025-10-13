import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { CboPayloadType } from "@/types/cboTypes";

interface CboDatatableProps {
  columns: ColumnDef<CboPayloadType>[];
  payload: CboPayloadType[] | undefined;
}

const CboDatatable: React.FC<CboDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload!}
        title="List of all cbo in the system"
      />
    </>
  );
};

export default CboDatatable;
