import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { WebAppMappersPayloadTypes } from '@/types/webAppMappersTypes';

interface WebAppMappersDatatableProps {
  columns: ColumnDef<WebAppMappersPayloadTypes>[];
  payload: WebAppMappersPayloadTypes[]
}

const WebAppMappersDatatable: React.FC<WebAppMappersDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all web app mappers in the system"
      />
    </>
  )
}

export default WebAppMappersDatatable
