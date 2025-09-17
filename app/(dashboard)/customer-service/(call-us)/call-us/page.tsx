import CallUsList from '@/components/ui/call-us/call-us-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Call Us List | Jubilee Retail',

}


const page = () => {
  return (
    <>
      <CallUsList />
    </>
  )
}

export default page