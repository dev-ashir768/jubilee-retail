import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { ProductsTypes } from '@/types/productPlansTypes';

interface ProductPlansDatatableProps {
  columns: ColumnDef<ProductsTypes>[];
  payload: ProductsTypes[]
}

const ProductPlansDatatable: React.FC<ProductPlansDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all product plans in the system"
      />
    </>
  )
}

export default ProductPlansDatatable
