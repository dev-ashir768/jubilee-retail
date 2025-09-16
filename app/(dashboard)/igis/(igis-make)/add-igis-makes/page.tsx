import AddIgisMake from '@/components/ui/igis-make/add-igis-make'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add IGIS Make | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <AddIgisMake />
    </>
  )
}

export default page