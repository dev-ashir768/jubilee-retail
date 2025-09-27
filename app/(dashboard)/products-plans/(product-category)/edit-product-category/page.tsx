import EditProductCategory from '@/components/ui/product-category/edit-product-category'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Product Category | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
     <EditProductCategory /> 
    </>
  )
}

export default page
