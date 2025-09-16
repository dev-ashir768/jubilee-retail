import AddPlan from '@/components/ui/plans/add-plan'
import { Metadata } from 'next'
import React from 'react'

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
