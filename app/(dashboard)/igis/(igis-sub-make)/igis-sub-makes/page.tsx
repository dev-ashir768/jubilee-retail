import IgisSubMakeList from '@/components/ui/igis-sub-make/igis-sub-make-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IGIS Sub Make List | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <IgisSubMakeList />
    </>
  )
}

export default page