import EditAgentForm from '@/components/ui/agent/edit-agent-form'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Agent | Jubilee Retail',
  description: 'Edit existing Agent in the Jubilee Retail system',
}

const page = () => {
  return (
    <>
      <EditAgentForm />
    </>
  )
}

export default page