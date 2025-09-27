"use client";

import { ProductOptionsSchema, ProductOptionsSchemaType } from '@/schemas/productOptionsSchema';
import { ProductOptionsResponseTypes } from '@/types/productOptionsTypes';
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

interface AddProductOptionsFormProps {
  productList: ProductsPayloadTypes[]
}

const AddProductOptionsForm: React.FC<AddProductOptionsFormProps> = ({ productList }) => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-options'
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== REACT HOOK FORM ========
  const { handleSubmit, register, formState: { errors }, control } = useForm({
    resolver: zodResolver(ProductOptionsSchema),
    defaultValues: {
      product_id: undefined,
      option_name: "",
      price: undefined,
      duration: undefined,
      duration_type: undefined,
      plan_code: "",
      start_limit: undefined,
      end_limit: undefined,
      start_limit_mother: undefined,
      end_limit_mother: undefined,
      stamp_duty: undefined,
      sales_tax: undefined,
      federal_insurance_fee: undefined,
      gross_premium: undefined,
      subtotal: undefined,
      administrative_subcharges: undefined
    }
  })

  // ======== MUTATION HANDLER ========
  const addProductOptionsMutation = useMutation<ProductOptionsResponseTypes, AxiosError<ProductOptionsResponseTypes>, ProductOptionsSchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/product-options",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add product options mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['product-options-list'] })
      router.push(LISTING_ROUTE)

    }
  })

  // ======== SELECT OPTIONS ========
  const durationTypeOptions = [
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const projectOptions = productList.map((item) => ({ value: item.id, label: item.product_name }));

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: ProductOptionsSchemaType) => {

    const finalData = {
      ...data,
    }

    if (!finalData.plan_code) {
      delete finalData.plan_code;
    }

    addProductOptionsMutation.mutate(finalData);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
        <div className='space-y-6'>
          {/* Project Id */}
          <div className='space-y-2'>
            <Label htmlFor='product_id' className='gap-1 text-gray-600'>
              Project<span className='text-red-500 text-md'>*</span>
            </Label>
            <Controller
              name='product_id'
              control={control}
              render={({ field }) => (
                <Select
                  id="product_id"
                  options={projectOptions}
                  value={projectOptions.find((item) => Number(item.value) === Number(field.value))}
                  onChange={(val) => field.onChange(val ? val.value : undefined)}
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.product_id && <p className='text-red-500 text-sm'>{errors.product_id.message}</p>}
          </div>

          {/* Option Name */}
          <div className='space-y-2'>
            <Label htmlFor='option_name' className='gap-1 text-gray-600'>
              Option Name<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="text"
              id="option_name"
              {...register("option_name")}
              placeholder="Enter Option Name"
            />
            {errors.option_name && <p className='text-red-500 text-sm'>{errors.option_name.message}</p>}
          </div>

          {/* Price */}
          <div className='space-y-2'>
            <Label htmlFor='price' className='gap-1 text-gray-600'>
              Price<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="price"
              {...register("price", { valueAsNumber: true })}
              placeholder="e.g., 1500.00"
            />
            {errors.price && <p className='text-red-500 text-sm'>{errors.price.message}</p>}
          </div>

          {/* Duration Type */}
          <div className='space-y-2'>
            <Label htmlFor='duration_type' className='gap-1 text-gray-600'>
              Duration Type<span className='text-red-500 text-md'>*</span>
            </Label>
            <Controller
              name='duration_type'
              control={control}
              render={({ field }) => (
                <Select
                  id="duration_type"
                  options={durationTypeOptions}
                  value={durationTypeOptions.find((item) => item.value === field.value)}
                  onChange={(val) => field.onChange(val ? val.value : '')}
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.duration_type && <p className='text-red-500 text-sm'>{errors.duration_type.message}</p>}
          </div>

          {/* Duration */}
          <div className='space-y-2'>
            <Label htmlFor='duration' className='gap-1 text-gray-600'>
              Duration<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="duration"
              {...register("duration", { valueAsNumber: true })}
              placeholder="e.g., 12"
            />
            {errors.duration && <p className='text-red-500 text-sm'>{errors.duration.message}</p>}
          </div>

          {/* Start Limit */}
          <div className='space-y-2'>
            <Label htmlFor='start_limit' className='gap-1 text-gray-600'>
              Start Limit<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="start_limit"
              {...register("start_limit", { valueAsNumber: true })}
              placeholder="e.g., 18"
            />
            {errors.start_limit && <p className='text-red-500 text-sm'>{errors.start_limit.message}</p>}
          </div>

          {/* End Limit */}
          <div className='space-y-2'>
            <Label htmlFor='end_limit' className='gap-1 text-gray-600'>
              End Limit<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="end_limit"
              {...register("end_limit", { valueAsNumber: true })}
              placeholder="e.g., 65"
            />
            {errors.end_limit && <p className='text-red-500 text-sm'>{errors.end_limit.message}</p>}
          </div>

          {/* Start Limit Mother */}
          <div className='space-y-2'>
            <Label htmlFor='start_limit_mother' className='gap-1 text-gray-600'>
              Start Limit Mother<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="start_limit_mother"
              {...register("start_limit_mother", { valueAsNumber: true })}
              placeholder="e.g., 18"
            />
            {errors.start_limit_mother && <p className='text-red-500 text-sm'>{errors.start_limit_mother.message}</p>}
          </div>

          {/* End Limit Mother */}
          <div className='space-y-2'>
            <Label htmlFor='end_limit_mother' className='gap-1 text-gray-600'>
              End Limit<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="end_limit_mother"
              {...register("end_limit_mother", { valueAsNumber: true })}
              placeholder="e.g., 65"
            />
            {errors.end_limit_mother && <p className='text-red-500 text-sm'>{errors.end_limit_mother.message}</p>}
          </div>

          {/* Stamp Duty */}
          <div className='space-y-2'>
            <Label htmlFor='stamp_duty' className='gap-1 text-gray-600'>
              Stamp Duty<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="stamp_duty"
              {...register("stamp_duty", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.stamp_duty && <p className='text-red-500 text-sm'>{errors.stamp_duty.message}</p>}
          </div>

          {/* Sales Tax */}
          <div className='space-y-2'>
            <Label htmlFor='sales_tax' className='gap-1 text-gray-600'>
              Sales Tax<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="sales_tax"
              {...register("sales_tax", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.sales_tax && <p className='text-red-500 text-sm'>{errors.sales_tax.message}</p>}
          </div>

          {/* Federal Insurance Fee */}
          <div className='space-y-2'>
            <Label htmlFor='federal_insurance_fee' className='gap-1 text-gray-600'>
              Federal Insurance Fee<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="federal_insurance_fee"
              {...register("federal_insurance_fee", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.federal_insurance_fee && <p className='text-red-500 text-sm'>{errors.federal_insurance_fee.message}</p>}
          </div>

          {/* Gross Premium */}
          <div className='space-y-2'>
            <Label htmlFor='gross_premium' className='gap-1 text-gray-600'>
              Gross Premium<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="gross_premium"
              {...register("gross_premium", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.gross_premium && <p className='text-red-500 text-sm'>{errors.gross_premium.message}</p>}
          </div>

          {/* Subtotal */}
          <div className='space-y-2'>
            <Label htmlFor='subtotal' className='gap-1 text-gray-600'>
              Subtotal<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="subtotal"
              {...register("subtotal", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.subtotal && <p className='text-red-500 text-sm'>{errors.subtotal.message}</p>}
          </div>

          {/* Administrative Surcharges */}
          <div className='space-y-2'>
            <Label htmlFor='administrative_subcharges' className='gap-1 text-gray-600'>
              Administrative Surcharges<span className='text-red-500 text-md'>*</span>
            </Label>
            <Input
              type="number"
              id="administrative_subcharges"
              {...register("administrative_subcharges", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.administrative_subcharges && <p className='text-red-500 text-sm'>{errors.administrative_subcharges.message}</p>}
          </div>

          {/* Plan Code */}
          <div className='space-y-2'>
            <Label htmlFor='plan_code' className='gap-1 text-gray-600'>Plan Code</Label>
            <Input
              type="text"
              id="plan_code"
              {...register("plan_code")}
              placeholder="Enter Plan Code"
            />
            {errors.plan_code && <p className='text-red-500 text-sm'>{errors.plan_code.message}</p>}
          </div>

          <div>
            <Button type="submit" className="min-w-[150px] cursor-pointer" size="lg" disabled={addProductOptionsMutation.isPending}>
              {addProductOptionsMutation.isPending ? 'Submitting' : 'Submit'}
              {addProductOptionsMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddProductOptionsForm;
