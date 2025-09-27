"use client";

import { ProductOptionsPayloadTypes } from '@/types/productOptionsTypes';
import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Button } from '../shadcn/button';
import Select from 'react-select';
import { singleSelectStyle } from '@/utils/selectStyles';
import { ProductsPayloadTypes } from '@/types/productsTypes';
import { PlanPayloadTypes } from '@/types/planTypes';
import { WebAppMappersSchema, WebAppMappersSchemaType } from '@/schemas/webAppMappersSchema';
import { WebAppMappersPayloadTypes, WebAppMappersResponseTypes } from '@/types/webAppMappersTypes';
import useWebAppMappersIdStore from '@/hooks/webAppMappersIdStore';

interface EditWebAppMappersFormProps {
  productList: ProductsPayloadTypes[];
  productOptionsList: ProductOptionsPayloadTypes[];
  planList: PlanPayloadTypes[];
  singleWebAppMapping: WebAppMappersPayloadTypes[]
}

const EditWebAppMappersForm: React.FC<EditWebAppMappersFormProps> = ({ productList, planList, productOptionsList, singleWebAppMapping }) => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/mapping/web-app-mapper'
  const queryClient = useQueryClient();
  const router = useRouter();
  const { webAppMapperId } = useWebAppMappersIdStore();

  // ======== REACT HOOK FORM ========
  const { handleSubmit, register, formState: { errors }, control } = useForm({
    resolver: zodResolver(WebAppMappersSchema),
    defaultValues: {
      child_sku: singleWebAppMapping[0]?.child_sku,
      option_id: singleWebAppMapping[0]?.option_id,
      parent_sku: singleWebAppMapping[0]?.parent_sku,
      plan_id: singleWebAppMapping[0]?.plan_id,
      product_id: singleWebAppMapping[0]?.product_id
    }
  })

  // ======== MUTATION HANDLER ========
  const addWebAppMappersMutation = useMutation<WebAppMappersResponseTypes, AxiosError<WebAppMappersResponseTypes>, WebAppMappersSchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/web-app-mappers",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Edit web app mapper mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['web-app-mappers-list'] })
      queryClient.invalidateQueries({ queryKey: ['single-web-app-mapper', webAppMapperId] })
      router.push(LISTING_ROUTE)
    }
  })

  // ======== SELECT OPTIONS ========
  const productOptions = productList.map((item) => ({ value: item.id, label: item.product_name }));
  const planListOptions = planList.map((item) => ({ value: item.id, label: item.name }));
  const productOptionOptions = productOptionsList.map((item) => ({ value: item.id, label: item.option_name }));

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: WebAppMappersSchemaType) => {

    const finalData = {
      ...data,
      webapp_mapper_id: webAppMapperId
    }

    addWebAppMappersMutation.mutate(finalData);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
        <div className='space-y-6'>
          {/* Parent SKU */}
          <div className='space-y-2'>
            <Label htmlFor='parent_sku' className='gap-1 text-gray-600'>
              Parent SKU<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="text"
              id="parent_sku"
              {...register("parent_sku")}
              placeholder="Enter Parent SKU"
            />
            {errors.parent_sku && <p className='text-red-500 text-sm'>{errors.parent_sku.message}</p>}
          </div>

          {/* Child SKU */}
          <div className='space-y-2'>
            <Label htmlFor='child_sku' className='gap-1 text-gray-600'>
              Child SKU<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="text"
              id="child_sku"
              {...register("child_sku")}
              placeholder="Enter Child SKU"
            />
            {errors.child_sku && <p className='text-red-500 text-sm'>{errors.child_sku.message}</p>}
          </div>

          {/* Plan ID */}
          <div className='space-y-2'>
            <Label htmlFor='plan_id' className='gap-1 text-gray-600'>
              Plan<span className='text-red-500 text-md'>*</span>
            </Label>
            <Controller
              name='plan_id'
              control={control}
              render={({ field }) => (
                <Select
                  id="plan_id"
                  options={planListOptions}
                  value={planListOptions.find((item) => item.value === field.value)}
                  onChange={(val) => field.onChange(val ? val.value : '')}
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.plan_id && <p className='text-red-500 text-sm'>{errors.plan_id.message}</p>}
          </div>

          {/* Product ID */}
          <div className='space-y-2'>
            <Label htmlFor='product_id' className='gap-1 text-gray-600'>
              Productlan<span className='text-red-500 text-md'>*</span>
            </Label>
            <Controller
              name='product_id'
              control={control}
              render={({ field }) => (
                <Select
                  id="product_id"
                  options={productOptions}
                  value={productOptions.find((item) => item.value === field.value)}
                  onChange={(val) => field.onChange(val ? val.value : '')}
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.product_id && <p className='text-red-500 text-sm'>{errors.product_id.message}</p>}
          </div>

          {/* Product Option ID */}
          <div className='space-y-2'>
            <Label htmlFor='option_id' className='gap-1 text-gray-600'>
              Product Option<span className='text-red-500 text-md'>*</span>
            </Label>
            <Controller
              name='option_id'
              control={control}
              render={({ field }) => (
                <Select
                  id="option_id"
                  options={productOptionOptions}
                  value={productOptionOptions.find((item) => item.value === field.value)}
                  onChange={(val) => field.onChange(val ? val.value : '')}
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.option_id && <p className='text-red-500 text-sm'>{errors.option_id.message}</p>}
          </div>

          <div>
            <Button type="submit" className="min-w-[150px] cursor-pointer" size="lg" disabled={addWebAppMappersMutation.isPending}>
              {addWebAppMappersMutation.isPending ? 'Submitting' : 'Submit'}
              {addWebAppMappersMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditWebAppMappersForm;
