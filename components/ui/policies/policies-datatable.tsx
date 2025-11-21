import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { PoliciesPayloadType } from "@/types/policiesTypes";

interface PoliciesDatatableProps {
  columns: ColumnDef<PoliciesPayloadType>[];
  payload: PoliciesPayloadType[] | undefined;
  isRefetching: boolean;
  handleRefetch: () => void;
}

const PoliciesDatatable: React.FC<PoliciesDatatableProps> = ({
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
        title="List of all orders list in the system"
      />
    </>
  );
};

export default PoliciesDatatable;
