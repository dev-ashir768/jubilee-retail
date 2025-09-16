import { Metadata } from 'next'
import AddPlan from '@/components/ui/plans/add-plan'

export const metadata: Metadata = {
  title: 'Add Plan | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <AddPlan />
    </>
  )
}

export default page
