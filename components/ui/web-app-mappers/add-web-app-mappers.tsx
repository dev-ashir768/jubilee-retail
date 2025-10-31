"use client"

import { getRights } from '@/utils/getRights';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchAllProductsList } from '@/helperFunctions/productsFunction';
import { ProductsResponseTypes } from '@/types/productsTypes';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import { PlanResponseTypes } from '@/types/planTypes';
import { fetchPlansList } from '@/helperFunctions/plansFunction';
import { ProductOptionsResponseTypes } from '@/types/productOptionsTypes';
import { fetchProductOptionsList } from '@/helperFunctions/productOptionsFunction';
import AddWebAppMappersForm from './add-web-app-mappers-form';

const AddWebAppMappers = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-options'
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE]);

  // ======== REDIRECTION EFFECT ========
  useEffect(() => {
    if (rights.can_create !== "1") {
      const timer = setTimeout(() => {
        router.push('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  // ======== DATA FETCHING ========
  const { data: productListResponse, isLoading: productListLoading, isError: productListIsError, error: productListError } = useQuery<ProductsResponseTypes | null>({
    queryKey: ['all-products-list'],
    queryFn: fetchAllProductsList
  })

  const { data: planListResponse, isLoading: planListLoading, isError: planListIsError, error: planListError } = useQuery<PlanResponseTypes | null>({
    queryKey: ['plans-list'],
    queryFn: fetchPlansList
  })

  const { data: productOptionsListResponse, isLoading: productOptionsListLoading, isError: productOptionsListIsError, error: productOptionsListError } = useQuery<ProductOptionsResponseTypes | null>({
    queryKey: ['product-options-list'],
    queryFn: fetchProductOptionsList
  })

  // ======== PAYLOADS DATA ========
  const productList = productListResponse?.payload || [];
  const planList = planListResponse?.payload || [];
  const productOptionsList = productOptionsListResponse?.payload || [];

  // ======== RENDER LOGIC ========
  const isLoading = productListLoading || planListLoading || productOptionsListLoading
  const isError = productListIsError || planListIsError || productOptionsListIsError
  const onError = productListError?.message || planListError?.message || productOptionsListError?.message

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
              Add a new Web App Mappers to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><AddWebAppMappersForm productList={productList} planList={planList} productOptionsList={productOptionsList} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddWebAppMappers
