import EditUsersForm from '@/components/ui/users/edit-users-form'
import React from 'react'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Users | Jubilee Retail',
  description: 'Edit multiple users in the Jubilee Retail system, updating roles and permissions as needed.',
}

const page = () => {
  return (
    <>
      <EditUsersForm />
    </>
  )
}

export default page