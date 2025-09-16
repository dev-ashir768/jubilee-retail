"use client";

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getRights } from '@/utils/getRights'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddIgisMakeForm from './add-igis-make-form';

const AddIgisMake = () => {
  // Constants
  const LISTING_ROUTE = '/igis/igis-makes'

  const router = useRouter()

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])


  if (rights?.can_create !== "1") {
    router.push(LISTING_ROUTE)
  }

  return (
    <>
      <SubNav
        title='Add IGIS make'
      />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}>
                  <ArrowLeft className='size-6' />
                </Link>
              </Button>
              Add a new IGIS make to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <AddIgisMakeForm />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddIgisMake
