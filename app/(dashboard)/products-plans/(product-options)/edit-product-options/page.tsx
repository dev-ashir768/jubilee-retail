import EditProductOptions from '@/components/ui/product-options/edit-product-options'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Product Option | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
     <EditProductOptions /> 
    </>
  )
}

export default page
