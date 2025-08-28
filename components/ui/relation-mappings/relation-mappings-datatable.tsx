import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { RelationMappingsPayloadTypes } from '@/types/relationMappingsTypes';

interface RelationMappingsDatatableProps {
  columns: ColumnDef<RelationMappingsPayloadTypes>[];
  payload: RelationMappingsPayloadTypes[]
}

const RelationMappingsDatatable: React.FC<RelationMappingsDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all relation mappings in the system"
      />
    </>
  )
}

export default RelationMappingsDatatable
