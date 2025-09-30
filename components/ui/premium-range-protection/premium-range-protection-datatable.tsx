import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { PremiumRangeProtectionsPayloadType } from '@/types/premiumRangeProtectionsTypes';

interface PremiumRangeProtectionDatatableProps {
  columns: ColumnDef<PremiumRangeProtectionsPayloadType>[];
  payload: PremiumRangeProtectionsPayloadType[]
}

const PremiumRangeProtectionDatatable: React.FC<PremiumRangeProtectionDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all Premium Range Protections in the system"
      />
    </>
  )
}

export default PremiumRangeProtectionDatatable
