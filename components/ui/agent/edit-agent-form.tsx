"use client";

import React, { useEffect, useMemo, useState } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AgentSchema, { AgentSchemaType } from '@/schemas/agentSchema'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { AgentResponseTypes } from '@/types/agentTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { toast } from 'sonner';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import Select from 'react-select';
import { fetchBranchList } from '@/helperFunctions/branchFunction';
import { BranchResponseTypes } from '@/types/branchTypes';
import { DevelopmentOfficerResponseTypes } from '@/types/developmentOfficerTypes';
import { fetchDevelopmentOfficerList } from '@/helperFunctions/developmentOfficerFunction';
import { Checkbox } from '../shadcn/checkbox';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import useAgentIdStore from '@/hooks/useAgentIdStore';
import { fetchSingleAgent } from '@/helperFunctions/agentFunction';
import { getRights } from '@/utils/getRights';
import LoadingState from '../foundations/loading-state';

const EditAgentForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const { agentId } = useAgentIdStore()
  const pathname = usePathname();
  // Define constants
  const LISTING_ROUTE = '/agents-dos/agents'

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit existing agent" />;
  }

  // Fetch single agent data using react-query
  const { data: singleAgentResponse, isLoading: singleAgentLoading, isError: singleAgentIsError, error: singleAgentError } = useQuery<AgentResponseTypes | null>({
    queryKey: ['single-agent', agentId],
    queryFn: () => fetchSingleAgent(agentId!),
    enabled: !!agentId // Only fetch if agentId is available
  })

  // Memoize via useMemo
  const memoizeSingleAgentResponse = useMemo(() => {
    if (singleAgentResponse) return singleAgentResponse?.payload[0]
    return null
  }, [singleAgentResponse])

  // Fetch branch list data using react-query
  const { data: branchListResponse, isLoading: branchListLoading, isError: branchListIsError, error: branchListError } = useQuery<BranchResponseTypes | null>({
    queryKey: ['get-branch-list'],
    queryFn: fetchBranchList
  })

  const branchOptions = branchListResponse?.payload?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Fetch development officer list data using react-query
  const { data: developmentOfficerListResponse, isLoading: developmentOfficerListLoading, isError: developmentOfficerListIsError, error: developmentOfficerListError } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ['get-development-officers-list'],
    queryFn: fetchDevelopmentOfficerList,
  });

  const developmentOfficerOptions = developmentOfficerListResponse?.payload?.map((item) => ({
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
    setValue,
  } = useForm({
    resolver: zodResolver(AgentSchema),
    defaultValues: {
      name: "",
      igis_code: "",
      igis_agent_code: "",
      branch_id: undefined,
      development_officer_id: undefined,
      idev_affiliate: false,
      idev_id: null,
    },
  });

  // Effect to populate form fields with fetched agent data
  useEffect(() => {
    if (memoizeSingleAgentResponse) {
      const affiliateValue = memoizeSingleAgentResponse.idev_affiliate || false;
      reset({
        name: memoizeSingleAgentResponse.name || '',
        igis_code: memoizeSingleAgentResponse.igis_code || '',
        igis_agent_code: memoizeSingleAgentResponse.igis_agent_code || '',
        branch_id: memoizeSingleAgentResponse.branch_id || undefined,
        development_officer_id: memoizeSingleAgentResponse.development_officer_id || undefined,
        idev_affiliate: affiliateValue,
        idev_id: memoizeSingleAgentResponse.idev_id || null,
      });
      setIsChecked(affiliateValue); // Initialize isChecked based on fetched idev_affiliate
    }
  }, [reset, memoizeSingleAgentResponse])

  // Mutation to handle agent update via PUT request
  const editAgentMutation = useMutation<
    AgentResponseTypes,
    AxiosError<AgentResponseTypes>,
    AgentSchemaType
  >({
    mutationKey: ['edit-agent', agentId],
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/agents",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Edit agent mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset();
      queryClient.invalidateQueries({ queryKey: ['single-agent', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agents-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler to trigger mutation
  const onSubmit = (data: AgentSchemaType) => {
    editAgentMutation.mutate({ ...data, agent_id: agentId! })
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

  // Controller for React Select (Development Officer ID)
  const {
    field: { onChange: onChangeOfficer, value: developmentOfficerValue },
  } = useController({
    name: "development_officer_id",
    control,
    defaultValue: undefined,
    rules: { required: true },
  });

  // Loading state
  if (developmentOfficerListLoading || branchListLoading || singleAgentLoading) {
    return <LoadingState />
  }

  // Error state
  if (branchListIsError || developmentOfficerListIsError || singleAgentIsError) {
    return <Error err={branchListError?.message || developmentOfficerListError?.message || singleAgentError?.message} />
  }

  // Empty and redirect state
  if (!agentId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    })
    return <Empty title="Not Found" description="Agent Id not Found. Redirecting to Agent List..." />;
  }


  return (
    <>
      <SubNav title="Edit Agent" />

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
              Edit existing agent to the system
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
                    placeholder="Enter agent name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
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

                {/* IGIS Agent Code */}
                <div className="space-y-2">
                  <Label htmlFor="igis_agent_code" className="gap-1 text-gray-600">
                    IGIS Agent Code<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="igis_agent_code"
                    {...register("igis_agent_code")}
                    placeholder="Enter IGIS agent code"
                  />
                  {errors.igis_agent_code && (
                    <p className="text-red-500 text-sm">{errors.igis_agent_code.message}</p>
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

                {/* Development Officer ID */}
                <div className="space-y-2">
                  <Label htmlFor="development_officer_id" className="gap-1 text-gray-600">
                    Development Officer ID<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Select
                    id="development_officer_id"
                    options={developmentOfficerOptions}
                    value={developmentOfficerOptions?.find(option => option.value === developmentOfficerValue) || null}
                    onChange={(selectedOption) => onChangeOfficer(selectedOption ? selectedOption.value : null)}
                    placeholder="Select Officer"
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
                  {errors.development_officer_id && (
                    <p className="text-red-500 text-sm">{errors.development_officer_id.message}</p>
                  )}
                </div>

                {/* IDEV Affiliate */}
                <div className="flex gap-2">
                  <Checkbox
                    id="idev_affiliate"
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      setValue("idev_affiliate", checked as boolean);
                      setIsChecked(checked as boolean)
                    }}
                  />
                  <Label htmlFor="idev_affiliate" className="gap-1 text-gray-600">
                    IDEV Affiliate
                  </Label>
                  {errors.idev_affiliate && (
                    <p className="text-red-500 text-sm">{errors.idev_affiliate.message}</p>
                  )}
                </div>

                {/* IDEV ID */}
                {isChecked && (
                  <div className="space-y-2">
                    <Label htmlFor="idev_id" className="gap-1 text-gray-600">
                      IDEV ID
                    </Label>
                    <Input
                      type="number"
                      id="idev_id"
                      {...register("idev_id", { valueAsNumber: true })}
                      placeholder="Enter IDEV ID"
                    />
                    {errors.idev_id && (
                      <p className="text-red-500 text-sm">{errors.idev_id.message}</p>
                    )}
                  </div>

                )}

                {/* Form Action */}
                <div>
                  <Button
                    type="submit"
                    className="min-w-[150px] cursor-pointer"
                    size="lg"
                    disabled={editAgentMutation.isPending}
                  >
                    {editAgentMutation.isPending ? 'Submitting' : 'Submit'}
                    {editAgentMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
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

export default EditAgentForm