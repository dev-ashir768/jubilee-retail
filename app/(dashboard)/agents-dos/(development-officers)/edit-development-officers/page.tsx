import EditDevelopmentOfficerForm from '@/components/ui/development-officers/edit-development-officer-form'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Development Officer | Jubilee Retail',
  description: 'Edit existing Development Officer in the Jubilee Retail system',
}


const page = () => {
  return (
    <>
      <EditDevelopmentOfficerForm />
    </>
  )
}

export default page