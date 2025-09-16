import EditCity from '@/components/ui/city/edit-city'
import React from 'react'
import { Metadata } from 'next'

 export const metadata: Metadata = {
  title: 'Edit City | Jubilee Retail',
 } 

const page = () => {
  return (
    <>
      <EditCity />
    </>
  )
}

export default page