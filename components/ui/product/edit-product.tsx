"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditProductForm from './edit-product-form'
import { getRights } from '@/utils/getRights'
import { useQuery } from '@tanstack/react-query';
import { ProductCategoriesResponseTypes } from '@/types/productCategoriesTypes';
import { fetchProductCategoriesList } from '@/helperFunctions/productCategoriesFunction';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import useProductsIdStore from '@/hooks/useProductsIdStore';
import { ProductsResponseTypes } from '@/types/productsTypes';
import { fetchProductsList } from '@/helperFunctions/productsFunction';

const EditProduct = () => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product'

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])
  const { productsId } = useProductsIdStore();

  // ======== DATA FETCHING ========
  const { data: productCategoryListResponse, isLoading: productCategoryListLoading, isError: productCategoryListIsError, error: productCategoryListError } = useQuery<ProductCategoriesResponseTypes | null>({
    queryKey: ['product-categories-list'],
    queryFn: fetchProductCategoriesList,
  });

  const { data: singleProductResponse, isLoading: singleProductLoading, isError: singleProductIsError, error: singleProductError } = useQuery<ProductsResponseTypes | null>({
    queryKey: ['single-product', productsId],
    queryFn: fetchProductsList,
  });

  // ======== PAYLOADS DATA ========
  const productCategoryList = productCategoryListResponse?.payload || []
  const singleProduct = singleProductResponse?.payload || []

  // ======== RENDER LOGIC ========
  const isLoading = productCategoryListLoading || singleProductLoading
  const isError = productCategoryListIsError || singleProductIsError
  const onError = productCategoryListError?.message || singleProductError?.message

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />
  if (rights?.can_create === "0") return <Empty title="Permission Denied" description="You do not have permission." />
  if (!productsId) return <Empty title="Permission Denied" description="You do not have permission." />

  return (
    <>
      <SubNav title='Edit Product' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Edit existing product to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><EditProductForm productCategoryList={productCategoryList} singleProduct={singleProduct} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditProduct
