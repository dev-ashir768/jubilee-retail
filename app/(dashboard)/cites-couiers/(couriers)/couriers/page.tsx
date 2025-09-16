import CourierList from '@/components/ui/courier/courier-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courier List | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <CourierList />
    </>
  )
}

export default page