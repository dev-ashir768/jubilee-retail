import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../datatable/data-table";
import { OrdersListPayloadType } from "@/types/ordersListTypes";

interface OrdersListDatatableProps {
  columns: ColumnDef<OrdersListPayloadType>[];
  payload: OrdersListPayloadType[] | undefined;
  isRefetching: boolean;
  handleRefetch: () => void;
}

const OrdersListDatatable: React.FC<OrdersListDatatableProps> = ({
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

export default OrdersListDatatable;
