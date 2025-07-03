import AddDoForm from '@/components/ui/do/add-do-form'
import React from 'react'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Task | Jubilee Retail',
  description: 'Add a new task to the Jubilee Retail system, assigning priorities and due dates as needed.',
}

const page = () => {
  return (
    <>
      <AddDoForm />
    </>
  )
}

export default page