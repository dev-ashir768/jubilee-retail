import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { ProductsPayloadTypes } from '@/types/productsTypes';

interface ProductDatatableProps {
  columns: ColumnDef<ProductsPayloadTypes>[];
  payload: ProductsPayloadTypes[]
}

const ProductDatatable: React.FC<ProductDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all products in the system"
      />
    </>
  )
}

export default ProductDatatable
