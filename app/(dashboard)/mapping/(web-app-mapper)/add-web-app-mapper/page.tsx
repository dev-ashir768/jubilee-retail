import AddWebAppMappers from '@/components/ui/web-app-mappers/add-web-app-mappers'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Web App Mapper | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <AddWebAppMappers />
    </>
  )
}

export default page
