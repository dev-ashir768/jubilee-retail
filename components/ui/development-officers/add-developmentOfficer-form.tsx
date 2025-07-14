"use client";

import { fetchBranchList } from '@/helperFunctions/branchFunction';
import { BranchResponseTypes } from '@/types/branchTypes';
import { getRights } from '@/utils/getRights';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import Error from '../foundations/error';
import Loader from '../foundations/loading-state';
import { useController, useForm } from 'react-hook-form';
import Empty from '../foundations/empty';
import { DevelopmentOfficerSchema, DevelopmentOfficerSchemaType } from '@/schemas/developmentOfficerSchema';
import { toast } from 'sonner';
import { DevelopmentOfficerResponseTypes } from '@/types/developmentOfficerTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod';
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import Select from 'react-select'
import LoadingState from '../foundations/loading-state';

const AddDevelopmentOfficerForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  // Define constants
  const LISTING_ROUTE = '/agents-dos/development-officers'

  // Fetch branch list data using react-query
  const { data: branchListResponse, isLoading: branchListLoading, isError: branchListIsError, error: branchListError } = useQuery<BranchResponseTypes | null>({
    queryKey: ['get-branch-list'],
    queryFn: fetchBranchList
  })

  const branchOptions = branchListResponse?.payload?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(DevelopmentOfficerSchema),
    defaultValues: {
      name: "",
      branch_id: undefined,
      igis_do_code: "",
      igis_code: "",
    },
  });

  // mutation
  const addDevelopmentOfficerMutation = useMutation<
    DevelopmentOfficerResponseTypes,
    AxiosError<DevelopmentOfficerResponseTypes>,
    DevelopmentOfficerSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/development-officers",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Add Development Officer mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset()
      queryClient.invalidateQueries({ queryKey: ['development-officers-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler
  const onSubmit = (data: DevelopmentOfficerSchemaType) => {
    addDevelopmentOfficerMutation.mutate(data)
  };

  // Controller for React Select (Branch ID)
  const {
    field: { onChange: onChangeBranch, value: branchValue },
  } = useController({
    name: "branch_id",
    control,
    defaultValue: undefined,
    rules: { required: true },
  });

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to add a new development officer." />;
  }

  // loading state
  if (branchListLoading) {
    return <LoadingState />
  }

  // error state
  if (branchListIsError) {
    return <Error err={branchListError?.message} />
  }

  // empty state
  if (branchListResponse?.payload?.length === 0 || !branchListResponse?.payload) {
    return <Empty title="Not Found" description="No branches found to populate the form." />;
  }

  return (
    <>
      <SubNav title="Add Development Officer" />

      <Card className="w-full shadow-none border-none">
        <CardHeader className="border-b gap-0">
          <CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200"
                onClick={() => router.push(LISTING_ROUTE)}
              >
                <ArrowLeft className="size-6" />
              </Button>
              Add a new development officer to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="gap-1 text-gray-600">
                    Name<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    {...register("name")}
                    placeholder="Enter development officer name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* IGIS DO Code */}
                <div className="space-y-2">
                  <Label htmlFor="igis_do_code" className="gap-1 text-gray-600">
                    IGIS DO Code<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="igis_do_code"
                    {...register("igis_do_code")}
                    placeholder="Enter IGIS DO code"
                  />
                  {errors.igis_do_code && (
                    <p className="text-red-500 text-sm">{errors.igis_do_code.message}</p>
                  )}
                </div>

                {/* IGIS Code */}
                <div className="space-y-2">
                  <Label htmlFor="igis_code" className="gap-1 text-gray-600">
                    IGIS Code<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="igis_code"
                    {...register("igis_code")}
                    placeholder="Enter IGIS code"
                  />
                  {errors.igis_code && (
                    <p className="text-red-500 text-sm">{errors.igis_code.message}</p>
                  )}
                </div>

                {/* Branch ID */}
                <div className="space-y-2">
                  <Label htmlFor="branch_id" className="gap-1 text-gray-600">
                    Branch ID<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Select
                    id="branch_id"
                    options={branchOptions}
                    value={branchOptions?.find(option => option.value === branchValue) || null}
                    onChange={(selectedOption) => onChangeBranch(selectedOption ? selectedOption.value : null)}
                    placeholder="Select Branch"
                    className="w-full"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        padding: '2px',
                        height: '40px'
                      }),
                    }}
                  />
                  {errors.branch_id && (
                    <p className="text-red-500 text-sm">{errors.branch_id.message}</p>
                  )}
                </div>


                {/* Form Action */}
                <div>
                  <Button
                    type="submit"
                    className="min-w-[150px] cursor-pointer"
                    size="lg"
                    disabled={addDevelopmentOfficerMutation.isPending}
                  >
                    {addDevelopmentOfficerMutation.isPending ? 'Submitting' : 'Submit'}
                    {addDevelopmentOfficerMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddDevelopmentOfficerForm