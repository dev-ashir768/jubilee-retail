import EditWebAppMappers from '@/components/ui/web-app-mappers/edit-web-app-mappers'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Web App Mapper | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
     <EditWebAppMappers /> 
    </>
  )
}

export default page
