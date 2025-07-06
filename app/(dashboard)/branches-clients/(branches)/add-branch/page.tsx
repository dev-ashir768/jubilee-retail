import AddBranchForm from '@/components/ui/branch/add-branch-form'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Branch | Jubilee Retail',
  description: 'Add a new branch to the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <AddBranchForm />
    </>
  )
}

export default page