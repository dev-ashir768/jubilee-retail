"use client";

import { getRights } from '@/utils/getRights';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { fetchBranchList } from '@/helperFunctions/branchFunction';
import { BranchResponseTypes } from '@/types/branchTypes';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientSchema, ClientSchemaType } from '@/schemas/clientSchema';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import { toast } from 'sonner';
import { ClientResponseType } from '@/types/clientTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { Textarea } from '../shadcn/textarea';
import Select from 'react-select'
import LoadingState from '../foundations/loading-state';

const AddClientForm = () => {

  // Define constants
  const LISTING_ROUTE = '/branches-clients/Clients-list'

  const queryClient = useQueryClient();
  const router = useRouter();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to add a new client." />;
  }

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
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: "",
      igis_client_code: "",
      address: "",
      telephone: "",
      contact_person: "",
      branch_id: undefined,
    },
  });

  // mutation
  const addClientMutation = useMutation<
    ClientResponseType,
    AxiosError<ClientResponseType>,
    ClientSchemaType
  >({
    mutationKey: ['add-client'],
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/clients",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Add client mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset()
      queryClient.invalidateQueries({ queryKey: ['client-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler
  const onSubmit = (data: ClientSchemaType) => {
    addClientMutation.mutate(data)
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
      <SubNav title="Add Client" />

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
              Add a new client to the system
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
                    placeholder="Enter client name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* IGIS Client Code */}
                <div className="space-y-2">
                  <Label htmlFor="igis_client_code" className="gap-1 text-gray-600">
                    IGIS Client Code<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="igis_client_code"
                    {...register("igis_client_code")}
                    placeholder="Enter IGIS client code"
                  />
                  {errors.igis_client_code && (
                    <p className="text-red-500 text-sm">{errors.igis_client_code.message}</p>
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

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="gap-1 text-gray-600">
                    Address<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="Enter address"
                    className='resize-none'
                    rows={6}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="gap-1 text-gray-600">
                    Telephone<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    {...register("telephone")}
                    placeholder="Enter telephone"
                    maxLength={11}
                  />
                  {errors.telephone && (
                    <p className="text-red-500 text-sm">{errors.telephone.message}</p>
                  )}
                </div>

                {/* Contact Person */}
                <div className="space-y-2">
                  <Label htmlFor="contact_person" className="gap-1 text-gray-600">
                    Contact Person<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="contact_person"
                    {...register("contact_person")}
                    placeholder="Enter contact person"
                  />
                  {errors.contact_person && (
                    <p className="text-red-500 text-sm">{errors.contact_person.message}</p>
                  )}
                </div>

                {/* Form Action */}
                <div>
                  <Button
                    type="submit"
                    className="min-w-[150px] cursor-pointer"
                    size="lg"
                    disabled={addClientMutation.isPending}
                  >
                    {addClientMutation.isPending ? 'Submitting' : 'Submit'}
                    {addClientMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
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

export default AddClientForm