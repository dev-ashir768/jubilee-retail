"use client"

import { getRights } from '@/utils/getRights';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchProductsList } from '@/helperFunctions/productsFunction';
import { ProductsResponseTypes } from '@/types/productsTypes';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import { PlanResponseTypes } from '@/types/planTypes';
import { fetchPlansList } from '@/helperFunctions/plansFunction';
import { ProductOptionsResponseTypes } from '@/types/productOptionsTypes';
import { fetchProductOptionsList } from '@/helperFunctions/productOptionsFunction';
import EditWebAppMappersForm from './edit-web-app-mappers-form';
import useWebAppMappersIdStore from '@/hooks/webAppMappersIdStore';
import { WebAppMappersResponseTypes } from '@/types/webAppMappersTypes';
import { fetchSingleWebAppMappers } from '@/helperFunctions/webAppMappersFunction';

const EditWebAppMappers = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-options'
  const router = useRouter();
  const { webAppMapperId } = useWebAppMappersIdStore();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE]);

  // ======== REDIRECTION EFFECT ========
  useEffect(() => {
    if (rights.can_create !== "1" || !webAppMapperId) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rights, router, webAppMapperId]);

  // ======== DATA FETCHING ========
  const { data: productListResponse, isLoading: productListLoading, isError: productListIsError, error: productListError } = useQuery<ProductsResponseTypes | null>({
    queryKey: ['products-list'],
    queryFn: fetchProductsList
  })

  const { data: planListResponse, isLoading: planListLoading, isError: planListIsError, error: planListError } = useQuery<PlanResponseTypes | null>({
    queryKey: ['plans-list'],
    queryFn: fetchPlansList
  })

  const { data: productOptionsListResponse, isLoading: productOptionsListLoading, isError: productOptionsListIsError, error: productOptionsListError } = useQuery<ProductOptionsResponseTypes | null>({
    queryKey: ['product-options-list'],
    queryFn: fetchProductOptionsList
  })

  const { data: singleWebAppMappingResponse, isLoading: singleWebAppMappingLoading, isError: singleWebAppMappingIsError, error: singleWebAppMappingError } = useQuery<WebAppMappersResponseTypes | null>({
    queryKey: ['single-web-app-mapper', webAppMapperId],
    queryFn: () => fetchSingleWebAppMappers(webAppMapperId!),
    enabled: !!webAppMapperId,
  });

  // ======== PAYLOADS DATA ========
  const productList = productListResponse?.payload || [];
  const planList = planListResponse?.payload || [];
  const productOptionsList = productOptionsListResponse?.payload || [];
  const singleWebAppMapping = singleWebAppMappingResponse?.payload || [];

  // ======== RENDER LOGIC ========
  const isLoading = productListLoading || planListLoading || productOptionsListLoading || singleWebAppMappingLoading
  const isError = productListIsError || planListIsError || productOptionsListIsError || singleWebAppMappingIsError
  const onError = productListError?.message || planListError?.message || productOptionsListError?.message || singleWebAppMappingError?.message

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />

  if (rights?.can_create !== "1") {
    return <Empty title="Permission Denied" description="You do not have permission. Redirecting..." />;
  }

    if (!webAppMapperId) {
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
              Edit Web App Mappers to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><EditWebAppMappersForm productList={productList} planList={planList} productOptionsList={productOptionsList} singleWebAppMapping={singleWebAppMapping} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditWebAppMappers
