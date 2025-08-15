import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { PlanPayloadTypes } from '@/types/planTypes';

interface PlansDatatableProps {
  columns: ColumnDef<PlanPayloadTypes>[];
  payload: PlanPayloadTypes[]
}

const PlansDatatable: React.FC<PlansDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all plans in the system"
      />
    </>
  )
}

export default PlansDatatable
