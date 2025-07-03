import AddUsersForm from '@/components/ui/users/add-users-form'
import React from 'react'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Users | Jubilee Retail',
  description: 'Add multiple users to the Jubilee Retail system, assigning roles and permissions as needed.',
}

const page = () => {
  return (
    <>
      <AddUsersForm />
    </>
  )
}

export default page