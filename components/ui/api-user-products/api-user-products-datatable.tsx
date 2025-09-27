import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { ApiUserProductsPayloadType } from '@/types/apiUserProductsTypes';

interface ApiUserProductsDatatableProps {
  columns: ColumnDef<ApiUserProductsPayloadType>[];
  payload: ApiUserProductsPayloadType[]
}

const ApiUserProductsDatatable: React.FC<ApiUserProductsDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all api user products in the system"
      />
    </>
  )
}

export default ApiUserProductsDatatable
