import AddIgisSubMake from '@/components/ui/igis-sub-make/add-igis-sub-make'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add IGIS Sub Make | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <AddIgisSubMake />
    </>
  )
}

export default page