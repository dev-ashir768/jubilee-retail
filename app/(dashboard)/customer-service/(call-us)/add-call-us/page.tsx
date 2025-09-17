import AddCallUs from "@/components/ui/call-us/add-call-us"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Call Us | Jubilee Retail',

}

const page = () => {
  return (
    <>
      <AddCallUs />
    </>
  )
}

export default page
