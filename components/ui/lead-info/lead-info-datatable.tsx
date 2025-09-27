import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import DataTable from "../datatable/data-table";
import { LeadInfoPayloadTypes } from "@/types/leadInfoTypes";

interface LeadInfoDatatableProps {
  columns: ColumnDef<LeadInfoPayloadTypes>[];
  payload: LeadInfoPayloadTypes[];
}

const LeadInfoDatatable: React.FC<LeadInfoDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all Leads Info in the system"
      />
    </>
  );
};

export default LeadInfoDatatable;
