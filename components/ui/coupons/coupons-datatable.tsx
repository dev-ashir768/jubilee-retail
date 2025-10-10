import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { CouponsPayloadType } from "@/types/couponsTypes";

interface CouponsDatatableProps {
  columns: ColumnDef<CouponsPayloadType>[];
  payload: CouponsPayloadType[] | undefined;
}

const CouponsDatatable: React.FC<CouponsDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload!}
        title="List of all coupons in the system"
      />
    </>
  );
};

export default CouponsDatatable;
