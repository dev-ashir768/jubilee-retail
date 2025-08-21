import React from 'react'
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '../../datatable/data-table';
import { MotorQuotePayloadTypes } from '@/types/motorQuote';

interface ManageDatatableProps {
  columns: ColumnDef<MotorQuotePayloadTypes>[];
  payload: MotorQuotePayloadTypes[] | undefined;
}

const ManageDatatable: React.FC<ManageDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload!}
        title="List of all manage motor quote in the system"
      />
    </>
  )
}

export default ManageDatatable;
