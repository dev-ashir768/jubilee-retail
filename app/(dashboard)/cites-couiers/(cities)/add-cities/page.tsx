import AddCity from '@/components/ui/city/add-city'
import React from 'react'
import { Metadata } from 'next'

 export const metadata: Metadata = {
  title: 'Add City | Jubilee Retail',
 } 


const page = () => {
  return (
    <>
      <AddCity />
    </>
  )
}

export default page