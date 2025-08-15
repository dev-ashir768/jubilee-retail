"use client";

import React from 'react'
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Button } from '../shadcn/button';
import ProductCategorySchema, { ProductCategorySchemaType } from '@/schemas/productCategorySchema';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductCategoriesPayloadTypes, ProductCategoriesResponseTypes } from '@/types/productCategoriesTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useProductCategoryIdStore from '@/hooks/useProductCategoryStore';

interface EditProductCategoryFormProps {
  singleProductCategory: ProductCategoriesPayloadTypes[]
}

const EditProductCategoryForm: React.FC<EditProductCategoryFormProps> = ({ singleProductCategory }) => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-category'
  const queryClient = useQueryClient();
  const router = useRouter();
  const { productCategoryId } = useProductCategoryIdStore();

  // ======== REACT HOOK FORM ========
  const { handleSubmit, register, formState: { errors }, } = useForm({
    resolver: zodResolver(ProductCategorySchema),
    defaultValues: {
      name: singleProductCategory[0].name,
      igis_product_code: singleProductCategory[0].igis_product_code,
      department_id: singleProductCategory[0].department_id,
    }
  })

  // ======== MUTATION HANDLER ========
  const editProductCategoryMutation = useMutation<ProductCategoriesResponseTypes, AxiosError<ProductCategoriesResponseTypes>, ProductCategorySchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/product-categories",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Edit product category mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['product-categories-list'] })
      queryClient.invalidateQueries({ queryKey: ['single-product-category', productCategoryId] })
      router.push(LISTING_ROUTE)
    }
  })

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: ProductCategorySchemaType) => {
    const finalDate = {
      ...data,
      product_category_id: productCategoryId
    }
    editProductCategoryMutation.mutate(finalDate);
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
            <Button type="submit" className="min-w-[150px] cursor-pointer" size="lg" disabled={editProductCategoryMutation.isPending}>
              {editProductCategoryMutation.isPending ? 'Submitting' : 'Submit'}
              {editProductCategoryMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditProductCategoryForm
