import EditIgisMake from '@/components/ui/igis-make/edit-igis-make'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit IGIS Make  | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <EditIgisMake />
    </>
  )
}

export default page