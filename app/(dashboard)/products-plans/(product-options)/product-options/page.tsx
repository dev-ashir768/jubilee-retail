import ProductOptionsList from '@/components/ui/product-options/product-options-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Options List | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <ProductOptionsList />
    </>
  )
}

export default page
