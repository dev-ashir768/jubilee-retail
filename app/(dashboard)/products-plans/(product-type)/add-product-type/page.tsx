import AddProductTypes from '@/components/ui/product-types/add-product-types'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Product Type | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
     <AddProductTypes /> 
    </>
  )
}

export default page
