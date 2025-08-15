"use client";

import React from 'react'
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Button } from '../shadcn/button';
import ProductCategorySchema, { ProductCategorySchemaType } from '@/schemas/productCategorySchema';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductCategoriesResponseTypes } from '@/types/productCategoriesTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddProductCategoryForm = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-category'
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== REACT HOOK FORM ========
  const { handleSubmit, register, formState: { errors }, } = useForm({
    resolver: zodResolver(ProductCategorySchema),
    defaultValues: {
      name: "",
      igis_product_code: "",
      department_id: undefined,
    }
  })

  // ======== MUTATION HANDLER ========
  const addProductCategoryMutation = useMutation<ProductCategoriesResponseTypes, AxiosError<ProductCategoriesResponseTypes>, ProductCategorySchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/product-categories",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add product category mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['product-categories-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: ProductCategorySchemaType) => {
    addProductCategoryMutation.mutate(data);
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='gap-1 text-gray-600'>
              Name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type="text"
                id="name"
                {...register("name")}
                placeholder="Enter Plan Name"
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='igis_product_code' className='gap-1 text-gray-600'>
              IGIS Product Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="text"
              id="igis_product_code"
              {...register("igis_product_code")}
              placeholder="Enter IGIS Product Code"
              className={errors.igis_product_code ? 'border-red-500' : ''}
            />
            {errors.igis_product_code && <p className='text-red-500 text-sm'>{errors.igis_product_code.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='department_id' className='gap-1 text-gray-600'>
              Department Id<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="department_id"
              {...register("department_id", { valueAsNumber: true })}
              placeholder="Enter Department Id"
              className={errors.department_id ? 'border-red-500' : ''}
            />
            {errors.department_id && <p className='text-red-500 text-sm'>{errors.department_id.message}</p>}
          </div>
          <div>
            <Button type="submit" className="min-w-[150px] cursor-pointer" size="lg" disabled={addProductCategoryMutation.isPending}>
              {addProductCategoryMutation.isPending ? 'Submitting' : 'Submit'}
              {addProductCategoryMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddProductCategoryForm
