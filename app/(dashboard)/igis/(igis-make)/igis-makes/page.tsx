import IgisMakeList from '@/components/ui/igis-make/igis-make-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IGIS Make List | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <IgisMakeList />
    </>
  )
}

export default page