import React from 'react'
import { Metadata } from "next"
import EditClientForm from '@/components/ui/client/edit-client-form'

export const metadata: Metadata = {
  title: 'Edit Client | Jubilee Retail',
  description: 'Edit existing client to the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <EditClientForm />
    </>
  )
}

export default page