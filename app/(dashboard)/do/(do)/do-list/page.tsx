import DoList from '@/components/ui/do/do-list'
import React from 'react'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Task List | Jubilee Retail',
  description: 'View and manage all tasks in the Jubilee Retail system, including their priorities and status.',
}

const page = () => {
  return (
    <>
      <DoList />
    </>
  )
}

export default page