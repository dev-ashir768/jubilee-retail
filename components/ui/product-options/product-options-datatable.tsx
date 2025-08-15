import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { ProductOptionsPayloadTypes } from '@/types/productOptionsTypes';

interface ProductOptionsDatatableProps {
  columns: ColumnDef<ProductOptionsPayloadTypes>[];
  payload: ProductOptionsPayloadTypes[]
}

const ProductOptionsDatatable: React.FC<ProductOptionsDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all product options in the system"
      />
    </>
  )
}

export default ProductOptionsDatatable
