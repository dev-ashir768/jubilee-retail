import AddProductCategory from '@/components/ui/product-category/add-product-category'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Product Category | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
     <AddProductCategory /> 
    </>
  )
}

export default page
