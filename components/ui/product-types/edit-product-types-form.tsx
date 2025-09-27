import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Button } from '../shadcn/button';
import { Loader2 } from 'lucide-react';
import ProductTypesSchema, { ProductTypesSchemaType } from '@/schemas/productTypesSchema';
import { ProductTypePayloadTypes, ProductTypeResponseTypes } from '@/types/productTypeTypes';
import useProductTypesIdStore from '@/hooks/useProductTypesIdStore';

interface EditProductTypesFormProps {
  singleProductType: ProductTypePayloadTypes[]
}

const EditProductTypesForm: React.FC<EditProductTypesFormProps> = ({ singleProductType }) => {

  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/product-type'
  const queryClient = useQueryClient();
  const router = useRouter();
  const { productTypeId } = useProductTypesIdStore();

  // ======== REACT HOOK FORM ========
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(ProductTypesSchema),
    defaultValues: {
      name: singleProductType[0]?.name,
      days: singleProductType[0]?.days
    }
  })

  // ======== SELECT OPTIONS ========

  // ======== MUTATION HANDLER ========
  const editProductTypesMutation = useMutation<ProductTypeResponseTypes, AxiosError<ProductTypeResponseTypes>, ProductTypesSchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/product-types",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add product types mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['product-types-list'] })
      queryClient.invalidateQueries({ queryKey: ['single-product-type', productTypeId], })
      router.push(LISTING_ROUTE)
    }
  })

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: ProductTypesSchemaType) => {

    const finalData = {
      ...data,
      product_type_id: productTypeId
    }
    editProductTypesMutation.mutate(finalData);
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
                placeholder="Enter Name"
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='days' className='gap-1 text-gray-600'>
              Days<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type="number"
                id="days"
                {...register("days", {valueAsNumber: true})}
                placeholder="Enter Days"
              />
              {errors.days && (
                <p className='text-red-500 text-sm'>
                  {errors.days.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button type="submit" className="min-w-[150px] cursor-pointer" size="lg" disabled={editProductTypesMutation.isPending}>
              {editProductTypesMutation.isPending ? 'Submitting' : 'Submit'}
              {editProductTypesMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditProductTypesForm
