import EditProduct from '@/components/ui/product/edit-product'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Product | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <EditProduct />
    </>
  )
}

export default page
