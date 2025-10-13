import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { PoliciesPayloadType } from "@/types/policiesTypes";

interface PoliciesDatatableProps {
  columns: ColumnDef<PoliciesPayloadType>[];
  payload: PoliciesPayloadType[] | undefined;
}

const PoliciesDatatable: React.FC<PoliciesDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload!}
        title="List of all orders list in the system"
      />
    </>
  );
};

export default PoliciesDatatable;
