import ProductList from '@/components/ui/product/product-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products List | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <ProductList />
    </>
  )
}

export default page
