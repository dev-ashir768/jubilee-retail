import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { OrdersListPayloadType } from "@/types/ordersListTypes";

interface OrdersListDatatableProps {
  columns: ColumnDef<OrdersListPayloadType>[];
  payload: OrdersListPayloadType[] | undefined;
}

const OrdersListDatatable: React.FC<OrdersListDatatableProps> = ({
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

export default OrdersListDatatable;
