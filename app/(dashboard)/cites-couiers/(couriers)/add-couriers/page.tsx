import AddCourier from '@/components/ui/courier/add-courier'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Courier | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <AddCourier />
    </>
  )
}

export default page