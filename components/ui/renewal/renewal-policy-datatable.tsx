import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { RenewalPolicyPayloadType } from "@/types/renewalPolicyTypes";

interface RenewalPolicyDatatableProps {
  columns: ColumnDef<RenewalPolicyPayloadType>[];
  payload: RenewalPolicyPayloadType[] | undefined;
}

const RenewalPolicyDatatable: React.FC<RenewalPolicyDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload!}
        title="List of all renewal policy in the system"
      />
    </>
  );
};

export default RenewalPolicyDatatable;
