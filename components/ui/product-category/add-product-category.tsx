"use client";

import { getRights } from '@/utils/getRights';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AddProductCategoryForm from './add-product-category-form';

const AddProductCategory = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-category'
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])

  // ======== RENDER LOGIC ========
  if (rights?.can_create !== "1") return router.push(LISTING_ROUTE)

  return (
    <>
      <SubNav title='Add Product Category' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Add a new product category to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><AddProductCategoryForm /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddProductCategory
