"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddProductForm from './add-product-form'
import { getRights } from '@/utils/getRights'
import { useQuery } from '@tanstack/react-query';
import { ProductCategoriesResponseTypes } from '@/types/productCategoriesTypes';
import { fetchProductCategoriesList } from '@/helperFunctions/productCategoriesFunction';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';

const AddProduct = () => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product'

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])

  // ======== DATA FETCHING ========
  const { data: productCategoryListResponse, isLoading: productCategoryListLoading, isError: productCategoryListIsError, error: productCategoryListError } = useQuery<ProductCategoriesResponseTypes | null>({
    queryKey: ['product-categories-list'],
    queryFn: fetchProductCategoriesList,
  });

  // ======== PAYLOADS DATA ========
  const productCategoryList = productCategoryListResponse?.payload || []

  // ======== RENDER LOGIC ========
  const isLoading = productCategoryListLoading
  const isError = productCategoryListIsError
  const onError = productCategoryListError?.message


  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />
  if (rights?.can_create !== "1") return <Empty title="Permission Denied" description="You do not have permission." />

  return (
    <>
      <SubNav title='Add Product' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Add a new product to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><AddProductForm productCategoryList={productCategoryList} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddProduct
