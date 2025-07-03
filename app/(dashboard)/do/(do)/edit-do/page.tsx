import EditDoForm from '@/components/ui/do/edit-do-form'
import React from 'react'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Task | Jubilee Retail',
  description: 'Edit an existing task in the Jubilee Retail system, updating priorities, status and assignments.',
}

const page = () => {
  return (
    <>
      <EditDoForm />
    </>
  )
}

export default page