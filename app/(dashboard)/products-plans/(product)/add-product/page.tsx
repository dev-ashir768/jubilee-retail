import AddProduct from '@/components/ui/product/add-product'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Product | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <AddProduct />
    </>
  )
}

export default page
