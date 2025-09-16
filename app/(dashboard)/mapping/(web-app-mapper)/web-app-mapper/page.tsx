import WebAppMappersList from '@/components/ui/web-app-mappers/web-app-mappers-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web App Mappers List | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
     <WebAppMappersList /> 
    </>
  )
}

export default page
