import EditBranchForm from "@/components/ui/branch/edit-branch-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Branch | Jubilee Retail',
  description: 'Edit branch to the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <EditBranchForm />
    </>
  )
}

export default page