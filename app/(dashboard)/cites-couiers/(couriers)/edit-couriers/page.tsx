import EditCourier from '@/components/ui/courier/edit-courier'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Courier | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <EditCourier />
    </>
  )
}

export default page