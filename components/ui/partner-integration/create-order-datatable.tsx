import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CreateBulkOrder } from "@/types/createBulkOrder";

interface OrdersListDatatableProps {
  columns: ColumnDef<CreateBulkOrder>[];
  payload: CreateBulkOrder[] | null;
}

const CreateOrderDatatable: React.FC<OrdersListDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable columns={columns} data={payload!} title="List of all orders" />
    </>
  );
};

export default CreateOrderDatatable;
