import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface OrdersListDatatableProps<TData> {
  columns: ColumnDef<TData>[];
  payload: TData[];
}

const CreateOrderDatatable = <TData,>({
  columns,
  payload,
}: OrdersListDatatableProps<TData>) => {
  return (
    <DataTable
      columns={columns}
      data={payload}
      title="List of all uploaded orders"
      enableColumnVisibility={false}
      enableExport={false}
    />
  );
};

export default CreateOrderDatatable;
