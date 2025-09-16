import AddProductOptions from '@/components/ui/product-options/add-product-options'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Product Option | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <AddProductOptions />
    </>
  )
}

export default page
