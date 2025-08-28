"use client"

import { getRights } from '@/utils/getRights';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EditProductOptionsForm from './edit-product-options-form';
import { fetchProductsList } from '@/helperFunctions/productsFunction';
import { ProductsResponseTypes } from '@/types/productsTypes';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import { ProductOptionsResponseTypes } from '@/types/productOptionsTypes';
import { fetchSingleProductOptions } from '@/helperFunctions/productOptionsFunction';
import useProductOptionsIdStore from '@/hooks/useProductOptionsIdStore';

const EditProductOptions = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-options'
  const router = useRouter();
  const { productOptionsId } = useProductOptionsIdStore();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE]);

  // ======== REDIRECTION EFFECT ========
  useEffect(() => {
    if (rights.can_edit !== "1" || !productOptionsId) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rights, router, productOptionsId]);

  // ======== DATA FETCHING ========
  const { data: productListResponse, isLoading: productListLoading, isError: productListIsError, error: productListError } = useQuery<ProductsResponseTypes | null>({
    queryKey: ['products-list'],
    queryFn: fetchProductsList
  })

  const { data: singleProductOptionResponse, isLoading: singleProductOptionLoading, isError: singleProductOptionIsError, error: singleProductOptionError } = useQuery<ProductOptionsResponseTypes | null>({
    queryKey: ['single-product-option', productOptionsId],
    queryFn: () => fetchSingleProductOptions(productOptionsId!),
    enabled: !!productOptionsId
  })

  // ======== PAYLOADS DATA ========
  const productList = productListResponse?.payload || [];
  const singleProductOption = singleProductOptionResponse?.payload || []

  // ======== RENDER LOGIC ========
  const isLoading = productListLoading || singleProductOptionLoading
  const isError = productListIsError || singleProductOptionIsError
  const onError = productListError?.message || singleProductOptionError?.message

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />

  if (rights?.can_edit !== "1") {
    return <Empty title="Permission Denied" description="You do not have permission. Redirecting..." />;
  }

  if (!productOptionsId) {
    return <Empty title="Permission Denied" description="You do not have permission. Redirecting..." />;
  }


  return (
    <>
      <SubNav title='Edit Product Option' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Edit existing product option to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><EditProductOptionsForm productList={productList} singleProductOption={singleProductOption} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditProductOptions
