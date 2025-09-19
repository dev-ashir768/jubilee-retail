"use client";

import React from 'react'
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EditProductCategoryForm from './edit-product-category-form';
import useProductCategoryIdStore from '@/hooks/useProductCategoryStore';
import { ProductCategoriesResponseTypes } from '@/types/productCategoriesTypes';
import { fetchSingleProductCategory } from '@/helperFunctions/productCategoriesFunction';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import { getRights } from '@/utils/getRights';

const EditProductCategory = () => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-category'
  const { productCategoryId } = useProductCategoryIdStore();
  console.log("productCategoryId", productCategoryId)
  const router = useRouter();


  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])


  // ======== DATA FETCHING ========
  const { data: singleProductCategoryResponse, isLoading: singleProductCategoryLoading, isError: singleProductCategoryIsError, error: singleProductCategoryError } = useQuery<ProductCategoriesResponseTypes | null>({
    queryKey: ['single-product-category', productCategoryId],
    queryFn: () => fetchSingleProductCategory(productCategoryId!),
    enabled: !!productCategoryId
  })

  // ======== PAYLOADS DATA ========
  const singleProductCategory = singleProductCategoryResponse?.payload || []

  // ======== RENDER LOGIC ========

  useEffect(() => {
    if (!rights) return;
    if (rights?.can_edit === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  const isLoading = singleProductCategoryLoading
  const isError = singleProductCategoryIsError
  const onError = singleProductCategoryError?.message


  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />
  if (!productCategoryId) return <Empty title="Permission Denied" description="ProductCategoryID not found." />
  if (rights?.can_edit === "0") {
    return (
      <Empty
        title="Permission Denied"
        description="You do not have rights to edit product category."
      />
    );
  }


  return (
    <>
      <SubNav title='Edit Product Category' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Edit existing product category to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><EditProductCategoryForm singleProductCategory={singleProductCategory} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditProductCategory
