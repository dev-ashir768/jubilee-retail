import RelationMappingsList from '@/components/ui/relation-mappings/relation-mappings-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Relation Mappings List | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
     <RelationMappingsList /> 
    </>
  )
}

export default page
