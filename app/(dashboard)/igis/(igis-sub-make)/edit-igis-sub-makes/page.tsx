import EditIgisSubMake from '@/components/ui/igis-sub-make/edit-igis-sub-make'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eidt IGIS Sub Make | Jubilee Retail',
  
}

const page = () => {
  return (
    <>
      <EditIgisSubMake />
    </>
  )
}

export default page