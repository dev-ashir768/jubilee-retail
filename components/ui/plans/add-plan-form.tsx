import PlanSchema, { PlanSchemaType } from '@/schemas/planSchema';
import { PlanResponseTypes } from '@/types/planTypes';
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

const AddPlanForm = () => {
  
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = '/products-plans/plan'
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== REACT HOOK FORM ========
  const { handleSubmit, register, formState: { errors }, } = useForm({
    resolver: zodResolver(PlanSchema),
    defaultValues: {
      name: "",
    }
  })

  // ======== MUTATION HANDLER ========
  const addCityMutation = useMutation<PlanResponseTypes, AxiosError<PlanResponseTypes>, PlanSchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/plans",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add plan mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['plans-list'] })
      router.push(LISTING_ROUTE)

    }
  })

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: PlanSchemaType) => {
    addCityMutation.mutate(data);
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

export default AddPlanForm
