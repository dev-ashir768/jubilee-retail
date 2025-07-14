"use client";

import { getRights } from '@/utils/getRights';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'
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
import Loader from '../foundations/loading-state';
import useClientIdStore from '@/hooks/useClientIdStore';
import { fetchSingleClient } from '@/helperFunctions/clientFunction';
import LoadingState from '../foundations/loading-state';

const EditClientForm = () => {

  const queryClient = useQueryClient();
  const router = useRouter();
  const { clientId } = useClientIdStore();
  // Constants
  const LISTING_ROUTE = '/branches-clients/Clients-list'

  // Fetch single client data using react-query
  const { data: singleClientResponse, isLoading: singleClientLoading, isError: singleClientIsError, error: singleClientError } = useQuery<ClientResponseType | null>({
    queryKey: ['single-client', clientId],
    queryFn: () => fetchSingleClient(clientId!),
    enabled: !!clientId // Only fetch if agentId is available
  })

  // Memoize via useMemo
  const memoizeSingleClientResponse = useMemo(() => {
    if (singleClientResponse) return singleClientResponse?.payload[0]
    return null
  }, [singleClientResponse])

  // Fetch branch list data using react-query
  const { data: branchListResponse, isLoading: branchListLoading, isError: branchListIsError, error: branchListError } = useQuery<BranchResponseTypes | null>({
    queryKey: ['edit-client-branch-list'],
    queryFn: fetchBranchList
  })

  const branchOptions = branchListResponse?.payload?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Initialize form with React Hook Form and Zod validation
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

  // Effect to populate form fields with fetched agent data
  useEffect(() => {
    if (memoizeSingleClientResponse) {
      reset({
        name: memoizeSingleClientResponse.name || '',
        address: memoizeSingleClientResponse.address || '',
        branch_id: memoizeSingleClientResponse.branch_id || undefined,
        contact_person: memoizeSingleClientResponse.contact_person || '',
        telephone: memoizeSingleClientResponse.telephone || '',
        igis_client_code: memoizeSingleClientResponse.igis_client_code || ''
      });
    }
  }, [reset, memoizeSingleClientResponse])

  // mutation
  const editClientMutation = useMutation<
    ClientResponseType,
    AxiosError<ClientResponseType>,
    ClientSchemaType
  >({
    mutationKey: ['edit-client', clientId],
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/clients",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Edit client mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset()
      queryClient.invalidateQueries({ queryKey: ['clients-list'] });
      queryClient.invalidateQueries({ queryKey: ['single-client', clientId] });
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler
  const onSubmit = (data: ClientSchemaType) => {
    editClientMutation.mutate({ ...data, client_id: clientId! })
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

  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit existing client." />;
  }

  // loading state
  if (branchListLoading || singleClientLoading) {
    return <LoadingState />
  }

  // error state
  if (branchListIsError || singleClientIsError) {
    return <Error err={branchListError?.message || singleClientError?.message} />
  }

  // empty state
  if (!clientId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    }, 1500);

    return <Empty title="Not Found" description="Client Id not Found. Redirecting to Client List..." />;
  }

  return (
    <>
      <SubNav title="Edit Client" />

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
              Edit existing client to the system
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
                    disabled={editClientMutation.isPending}
                  >
                    {editClientMutation.isPending ? 'Submitting' : 'Submit'}
                    {editClientMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
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

export default EditClientForm