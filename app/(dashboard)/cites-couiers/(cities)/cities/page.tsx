import CityList from '@/components/ui/city/city-list'
import React from 'react'
import { Metadata } from 'next'

 export const metadata: Metadata = {
  title: 'Cities List | Jubilee Retail',
 } 


const page = () => {
  return (
    <>
      <CityList />
    </>
  )
}

export default page