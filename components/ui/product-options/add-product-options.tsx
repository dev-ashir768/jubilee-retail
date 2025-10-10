"use client"

import { getRights } from '@/utils/getRights';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AddProductOptionsForm from './add-product-options-form';
import { fetchProductsList } from '@/helperFunctions/productsFunction';
import { ProductsResponseTypes } from '@/types/productsTypes';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';

const AddProductOptions = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-options'
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE]);

  // ======== REDIRECTION EFFECT ========
  useEffect(() => {
    if (rights.can_create == "0") {
      const timer = setTimeout(() => {
        router.push('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  // ======== DATA FETCHING ========
  const { data: productListResponse, isLoading: productListLoading, isError: productListIsError, error: productListError } = useQuery<ProductsResponseTypes | null>({
    queryKey: ['products-list'],
    queryFn: fetchProductsList
  })

  // ======== PAYLOADS DATA ========
  const productList = productListResponse?.payload || []

  // ======== RENDER LOGIC ========
  const isLoading = productListLoading
  const isError = productListIsError
  const onError = productListError?.message

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />

  if (rights?.can_create !== "1") {
    return <Empty title="Permission Denied" description="You do not have permission. Redirecting..." />;
  }


  return (
    <>
      <SubNav title='Add Product Option' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Add a new product option to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><AddProductOptionsForm productList={productList} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddProductOptions
