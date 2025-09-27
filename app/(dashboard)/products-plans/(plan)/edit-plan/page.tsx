import EditPlan from '@/components/ui/plans/edit-plan'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Plan | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
     <EditPlan/> 
    </>
  )
}

export default page
