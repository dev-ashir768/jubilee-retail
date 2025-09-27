"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditProductTypesForm from './edit-product-types-form'
import { getRights } from '@/utils/getRights'
import Empty from '../foundations/empty';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import useProductTypesIdStore from '@/hooks/useProductTypesIdStore';
import { ProductTypeResponseTypes } from '@/types/productTypeTypes';
import { useQuery } from '@tanstack/react-query';
import { fetchProductTypes } from '@/helperFunctions/productTypesFunction';

const EditProductTypes = () => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-type'
  const { productTypeId } = useProductTypesIdStore();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const { data: singleProductTypeResponse, isLoading: singleProductTypeLoading, isError: singleProductTypeIsError, error: singleProductTypeError } = useQuery<ProductTypeResponseTypes | null>({
    queryKey: ['single-product-type', productTypeId],
    queryFn: () => fetchProductTypes(productTypeId!),
    enabled: !!productTypeId
  })

  // ======== PAYLOADS DATA ========
  const singleProductType = singleProductTypeResponse?.payload || []

  // ======== RENDER LOGIC ========
  const isLoading = singleProductTypeLoading
  const isError = singleProductTypeIsError
  const onError = singleProductTypeError?.message

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />
  if (rights?.can_create !== "1") return <Empty title="Permission Denied" description="You do not have permission." />
  if (!productTypeId) return <Empty title="Permission Denied" description="You do not have permission." />
  return (
    <>
      <SubNav title='Edit Product Types' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Edit existing product types to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><EditProductTypesForm  singleProductType={singleProductType}/></div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditProductTypes
