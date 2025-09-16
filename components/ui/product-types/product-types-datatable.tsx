import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { ProductTypePayloadTypes } from '@/types/productTypeTypes';

interface ProductTypesDatatableProps {
  columns: ColumnDef<ProductTypePayloadTypes>[];
  payload: ProductTypePayloadTypes[]
}

const ProductTypesDatatable: React.FC<ProductTypesDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all product types in the system"
      />
    </>
  )
}

export default ProductTypesDatatable;
