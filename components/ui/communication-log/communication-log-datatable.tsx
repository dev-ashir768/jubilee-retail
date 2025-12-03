import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CommunicationLogsDataType } from '@/types/communicationLogsTypes';

interface CommunicationLogsDatatableProps {
  columns: ColumnDef<CommunicationLogsDataType>[];
  payload: CommunicationLogsDataType[]
}
const CommunicationLogsDatatable: React.FC<CommunicationLogsDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all call us data in the system"
      />
    </>
  )
}

export default CommunicationLogsDatatable