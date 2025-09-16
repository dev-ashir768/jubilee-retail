import EditProductTypes from '@/components/ui/product-types/edit-product-types'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Edit Type | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <EditProductTypes />
    </>
  )
}

export default page
