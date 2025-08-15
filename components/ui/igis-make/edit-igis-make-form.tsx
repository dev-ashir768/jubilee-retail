"use client";

import { IgisMakeSchema, IgisMakeSchemaType } from '@/schemas/IgisMakeSchema';
import { IgisMakePayloadType, IgisMakeResponseType } from '@/types/igisTypes';
import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { Button } from '../shadcn/button';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import useIgisMakeIdStore from '@/hooks/useIgisMakeIdStore';

interface EditIgisMakeForm {
  singleIgisMake: IgisMakePayloadType | undefined
}

const EditIgisMakeForm: React.FC<EditIgisMakeForm> = ({ singleIgisMake }) => {
  // Constants
  const LISTING_ROUTE = '/igis/igis-makes'

  const { igisMakeId } = useIgisMakeIdStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(IgisMakeSchema),
    defaultValues: {
      make_name: singleIgisMake ? singleIgisMake.make_name : "",
      igis_make_code: singleIgisMake ? singleIgisMake.igis_make_code : "",
    }
  })

  // Mutation handler
  const editIgisMakeMutation = useMutation<
    IgisMakeResponseType,
    AxiosError<IgisMakeResponseType>,
    IgisMakeSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: '/igis-makes',
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add igis make mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["single-igis-make", igisMakeId] })
      queryClient.invalidateQueries({ queryKey: ['igis-make-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit Form
  const onSubmit = (data: IgisMakeSchemaType) => {
    const finalData = {
      igis_make_code: data.igis_make_code,
      make_name: data.make_name,
      make_id: igisMakeId
    }
    editIgisMakeMutation.mutate(finalData);
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='make_name' className='gap-1 text-gray-600'>
              Make name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='make_name'
                placeholder='Enter Make name'
                {...register('make_name')}
              />
              {errors.make_name && (
                <p className='text-red-500 text-sm'>
                  {errors.make_name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='igis_make_code' className='gap-1 text-gray-600'>
              Igis Make Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='igis_make_code'
                placeholder='Enter igis make code'
                {...register('igis_make_code')}
              />
              {errors.igis_make_code && (
                <p className='text-red-500 text-sm'>
                  {errors.igis_make_code.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editIgisMakeMutation.isPending}
            >
              {editIgisMakeMutation.isPending ? 'Updating' : 'Update'}
              {editIgisMakeMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditIgisMakeForm