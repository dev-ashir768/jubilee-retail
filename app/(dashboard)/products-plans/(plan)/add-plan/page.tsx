import AddPlan from '@/components/ui/plans/add-plan'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Plan | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
     <AddPlan /> 
    </>
  )
}

export default page
