import ProductTypesList from '@/components/ui/product-types/product-types-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Types List | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <ProductTypesList />
    </>
  )
}

export default page
