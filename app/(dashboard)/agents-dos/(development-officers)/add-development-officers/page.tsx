import AddDevelopmentOfficerForm from '@/components/ui/development-officers/add-developmentOfficer-form'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Development Officer | Jubilee Retail',
  description: 'Add a new Development Officer in the Jubilee Retail system',
}


const page = () => {
  return (
    <>
      <AddDevelopmentOfficerForm />
    </>
  )
}

export default page