
import BranchList from '@/components/ui/branch/branch-list'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Branch List | Jubilee Retail',
  description: 'View and manage all branch in the Jubilee Retail system',
}
const page = () => {
  return (
    <>
      <BranchList />
    </>
  )
}

export default page