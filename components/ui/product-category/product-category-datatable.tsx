import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table';
import { ProductCategoriesPayloadTypes } from '@/types/productCategoriesTypes';

interface ProductCategoryDatatableProps {
  columns: ColumnDef<ProductCategoriesPayloadTypes>[];
  payload: ProductCategoriesPayloadTypes[]
}

const ProductCategoryDatatable: React.FC<ProductCategoryDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all product categories in the system"
      />
    </>
  )
}

export default ProductCategoryDatatable
