import PlansList from "@/components/ui/plans/plans-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Plan List | Jubilee Retail',
}

const page = () => {
  return (
    <>
      <PlansList />
    </>
  )
}

export default page
