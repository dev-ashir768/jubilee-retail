"use client";

import { axiosFunction } from "@/utils/axiosFunction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Loader2 } from "lucide-react";
import { PremiumRangeProtectionsResponseType } from "@/types/premiumRangeProtectionsTypes";
import {
  PremiumRangeProtectionSchema,
  PremiumRangeProtectionSchemaType,
} from "@/schemas/premiumRangeProtectionSchema";
import Select from "react-select";
import { singleSelectStyle } from "@/utils/selectStyles";
import { ApiUsersPayloadType } from "@/types/usersTypes";

interface AddPremiumRangeProtectionFormProps {
  apiUserList: ApiUsersPayloadType[];
}

const AddPremiumRangeProtectionForm: React.FC<
  AddPremiumRangeProtectionFormProps
> = ({ apiUserList }) => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/products-plans/premium-range-protection";
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== REACT HOOK FORM ========
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(PremiumRangeProtectionSchema),
    defaultValues: {
      api_user_id: undefined,
      duration: undefined,
      premium_start: "",
      premium_end: "",
      net_premium: "",
      duration_type: undefined,
    },
  });

  // ======== SELECT OPTIONS ========
  const durationType = [
    { label: "Months", value: "months" },
    { label: "Years", value: "years" },
    { label: "Days", value: "days" },
  ];

  const apiUserOptions = apiUserList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  // ======== MUTATION HANDLER ========
  const addPremiumRangeProtectionMutation = useMutation<
    PremiumRangeProtectionsResponseType,
    AxiosError<PremiumRangeProtectionsResponseType>,
    PremiumRangeProtectionSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/premium-range-protections",
        isServer: true,
        data: record,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Add premium range protection mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["premium-range-protections-list"],
      });
      router.replace(LISTING_ROUTE);
    },
  });

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: PremiumRangeProtectionSchemaType) => {
    addPremiumRangeProtectionMutation.mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          {/* PREMIUM START */}
          <div className="space-y-2">
            <Label htmlFor="premium_start" className="gap-1 text-gray-600">
              Premium Start <span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="premium_start"
                {...register("premium_start")}
                placeholder="e.g., 1000.00"
              />
              {errors.premium_start && (
                <p className="text-red-500 text-sm">
                  {errors.premium_start.message}
                </p>
              )}
            </div>
          </div>
          {/* PREMIUM END */}
          <div className="space-y-2">
            <Label htmlFor="premium_end" className="gap-1 text-gray-600">
              Premium End <span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="premium_end"
                {...register("premium_end")}
                placeholder="e.g., 5000.00"
              />
              {errors.premium_end && (
                <p className="text-red-500 text-sm">
                  {errors.premium_end.message}
                </p>
              )}
            </div>
          </div>
          {/* NET PREMIUM */}
          <div className="space-y-2">
            <Label htmlFor="net_premium">
              Net Premium<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="net_premium"
                {...register("net_premium")}
                placeholder="e.g., 3000.00"
              />
              {errors.net_premium && (
                <p className="text-red-500 text-sm">
                  {errors.net_premium.message}
                </p>
              )}
            </div>
          </div>
          {/* API USER ID */}
          <div className="space-y-2">
            <Label htmlFor="api_user_id">
              API User ID<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="api_user_id"
                control={control}
                render={({ field }) => (
                  <Select
                    options={apiUserOptions}
                    value={apiUserOptions.find(
                      (item) => item.value === field.value
                    )}
                    onChange={(selectedValue) =>
                      field.onChange(
                        selectedValue ? selectedValue.value : undefined
                      )
                    }
                    placeholder="Select api user"
                    styles={singleSelectStyle}
                  />
                )}
              />

              {errors.api_user_id && (
                <p className="text-red-500 text-sm">
                  {errors.api_user_id.message}
                </p>
              )}
            </div>
          </div>
          {/* DURATION */}
          <div className="space-y-2">
            <Label htmlFor="duration">
              Duration<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="number"
                id="duration"
                {...register("duration", { valueAsNumber: true })}
                placeholder="e.g., 12"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>
          {/* DURATION TYPE (Select/Enum) */}
          <div className="space-y-2">
            <Label htmlFor="duration_type">
              Duration Type<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="duration_type"
                control={control}
                render={({ field }) => (
                  <Select
                    options={durationType}
                    value={durationType.find(
                      (item) => item.value === field.value
                    )}
                    onChange={(selectedValue) =>
                      field.onChange(
                        selectedValue ? selectedValue.value : undefined
                      )
                    }
                    placeholder="Select duration type"
                    styles={singleSelectStyle}
                  />
                )}
              />
              {errors.duration_type && (
                <p className="text-red-500 text-sm">
                  {errors.duration_type.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addPremiumRangeProtectionMutation.isPending}
            >
              {addPremiumRangeProtectionMutation.isPending
                ? "Submitting"
                : "Submit"}
              {addPremiumRangeProtectionMutation.isPending && (
                <span className="animate-spin">
                  <Loader2 />
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddPremiumRangeProtectionForm;
