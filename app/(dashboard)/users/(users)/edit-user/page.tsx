import React from 'react'
import { Metadata } from "next"
import EditUserForm from '@/components/ui/users/edit-user-form'

export const metadata: Metadata = {
  title: 'Edit User | Jubilee Retail',
  description: 'Edit user details in the Jubilee Retail system, including roles and permissions.',
}
const page = () => {
  return (
    <>
      <EditUserForm />
    </>
  )
}

export default page