import { PlanResponseTypes } from '@/types/planTypes';
import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Button } from '../shadcn/button';
import { Loader2 } from 'lucide-react';
import Select from 'react-select';
import ProductSchema, { ProductSchemaType } from '@/schemas/productSchema';
import { singleSelectStyle } from '@/utils/selectStyles';
import { ProductCategoriesPayloadTypes } from '@/types/productCategoriesTypes';

interface AddProductFormProps {
  productCategoryList: ProductCategoriesPayloadTypes[]
}

const AddProductForm: React.FC<AddProductFormProps> = ({ productCategoryList }) => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product'
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== REACT HOOK FORM ========
  const { handleSubmit, register, formState: { errors }, control } = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      product_name: "",
      product_type: "",
      product_category_id: undefined
    }
  })

  // ======== SELECT OPTIONS ========
  const productCategoryOptions = productCategoryList.map((item) => ({ label: item.name, value: item.id })) || []

  // ======== MUTATION HANDLER ========
  const addCityMutation = useMutation<PlanResponseTypes, AxiosError<PlanResponseTypes>, ProductSchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/products",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add product mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['products-list'] })
      router.push(LISTING_ROUTE)

    }
  })

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: ProductSchemaType) => {
    addCityMutation.mutate(data);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='product_name' className='gap-1 text-gray-600'>
              Product Name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type="text"
                id="product_name"
                {...register("product_name")}
                placeholder="Enter product Name"
              />
              {errors.product_name && (
                <p className='text-red-500 text-sm'>
                  {errors.product_name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='product_type' className='gap-1 text-gray-600'>
              Product Type<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type="text"
                id="product_type"
                {...register("product_type")}
                placeholder="Enter product Name"
              />
              {errors.product_type && (
                <p className='text-red-500 text-sm'>
                  {errors.product_type.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='product_category_id' className='gap-1 text-gray-600'>
              Product Category<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Controller
                name='product_category_id'
                control={control}
                render={({ field }) => (
                  <Select
                    id="product_category_id"
                    value={productCategoryOptions.find((item) => item.value === field.value)}
                    options={productCategoryOptions}
                    onChange={(val) => field.onChange(val ? val.value : '')}
                    className="w-full"
                    styles={singleSelectStyle}
                  />
                )}
              />
              {errors.product_category_id && (
                <p className='text-red-500 text-sm'>
                  {errors.product_category_id.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button type="submit" className="min-w-[150px] cursor-pointer" size="lg" disabled={addCityMutation.isPending}>
              {addCityMutation.isPending ? 'Submitting' : 'Submit'}
              {addCityMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddProductForm
