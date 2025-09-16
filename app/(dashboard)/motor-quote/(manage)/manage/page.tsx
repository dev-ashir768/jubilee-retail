import MotorQuoteList from '@/components/ui/motor-quote/manage/manage-list'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Motor Quote | Jubilee Retail',
  
}


const page = () => {
  return (
    <>
      <MotorQuoteList />
    </>
  )
}

export default page
