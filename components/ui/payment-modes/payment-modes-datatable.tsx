import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { PaymentModesPayloadType } from '@/types/paymentModesTypes';

interface PaymentModesDatatableProps {
  columns: ColumnDef<PaymentModesPayloadType>[];
  payload: PaymentModesPayloadType[]
}

const PaymentModesDatatable: React.FC<PaymentModesDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all Payment Modes in the system"
      />
    </>
  )
}

export default PaymentModesDatatable
