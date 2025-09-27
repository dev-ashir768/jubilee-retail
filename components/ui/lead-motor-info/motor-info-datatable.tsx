import { LeadMotorInfoPayloadTypes } from "@/types/leadMotorInfoTypes";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import DataTable from "../datatable/data-table";

interface MotorInfoDatatableProps {
  columns: ColumnDef<LeadMotorInfoPayloadTypes>[];
    payload: LeadMotorInfoPayloadTypes[]
}

const MotorInfoDatatable:React.FC<MotorInfoDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all plans in the system"
      />
    </>
  );
};

export default MotorInfoDatatable;
