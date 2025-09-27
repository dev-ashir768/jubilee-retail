"use client";

import React from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditPlanForm from './edit-plan-form'
import { PlanResponseTypes } from '@/types/planTypes';
import { useQuery } from '@tanstack/react-query';
import usePlanIdStore from '@/hooks/usePlanIdStore';
import { fetchSinglePlan } from '@/helperFunctions/plansFunction';
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';

const EditPlan = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/plan'
  const { planId } = usePlanIdStore();

  // ======== DATA FETCHING ========
  const { data: singlePlanResponse, isLoading: singlePlanLoading, isError: singlePlanIsError, error: singlePlanError } = useQuery<PlanResponseTypes | null>({
    queryKey: ['single-plan', planId],
    queryFn: () => fetchSinglePlan(planId!),
    enabled: !!planId
  })

  // ======== PAYLOADS DATA ========
  const singlePlan = singlePlanResponse?.payload || []

  // ======== RENDER LOGIC ========
  const isLoading = singlePlanLoading
  const isError = singlePlanIsError
  const onError = singlePlanError?.message

  if (isLoading) return <LoadingState />
  if (isError) return <Error err={onError} />
  if (!planId) return <Empty title="Permission Denied" description="You do not have permission." />

  return (
    <>
      <SubNav title='Edit Plan' />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}><ArrowLeft className='size-6' /></Link>
              </Button>
              Edit existing plan to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'><EditPlanForm singlePlan={singlePlan} /></div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditPlan
