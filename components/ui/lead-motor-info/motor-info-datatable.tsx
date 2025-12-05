import { LeadMotorInfoPayloadTypes } from "@/types/leadMotorInfoTypes";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import DataTable from "../datatable/data-table";

interface MotorInfoDatatableProps {
  columns: ColumnDef<LeadMotorInfoPayloadTypes>[];
  payload: LeadMotorInfoPayloadTypes[];
  isRefetching: boolean;
  handleRefetch: () => void;
}

const MotorInfoDatatable: React.FC<MotorInfoDatatableProps> = ({
  columns,
  payload,
  isRefetching,
  handleRefetch,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        showRefetch={true}
        isRefetching={isRefetching}
        handleRefetch={handleRefetch}
        title="List of all plans in the system"
      />
    </>
  );
};

export default MotorInfoDatatable;
