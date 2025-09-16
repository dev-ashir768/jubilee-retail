import PlansList from "@/components/ui/plans/plans-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Plans List | Jubilee Retail',
  description: 'View all plans in the Jubilee Retail system',
}

const page = () => {
  return (
    <>
      <PlansList />
    </>
  )
}

export default page
