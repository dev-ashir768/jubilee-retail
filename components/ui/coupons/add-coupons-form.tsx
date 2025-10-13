"use client";

import { ProductsPayloadTypes } from "@/types/productsTypes";
import React from "react";
import { Button } from "../shadcn/button";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CouponsSchema, { CouponsSchemaType } from "@/schemas/couponsSchema";
import { CouponsResponseType } from "@/types/couponsTypes";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Calendar } from "../shadcn/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Select from "react-select";
import { multiSelectStyle, singleSelectStyle } from "@/utils/selectStyles";

interface AddCouponsForm {
  productList: ProductsPayloadTypes[];
}

const AddCouponsForm: React.FC<AddCouponsForm> = ({ productList }) => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/coupons-management/coupons";
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== REACT HOOK FORM ========
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CouponsSchema),
    defaultValues: {
      code: "",
      campaign_name: "",
      expiry_date: undefined,
      application_date: undefined,
      quantity: undefined,
      discount_value: undefined,
      use_per_customer: undefined,
      coupon_type: undefined,
      products: undefined,
    },
  });

  // REACT SELECT OPTION
  const couponTypeOptions = [
    { value: "percentage", label: "percentage" },
    { value: "flat", label: "flat" },
    { value: "other", label: "other" },
  ];

  const productOptions = productList.map((item) => ({
    value: item.id,
    label: item.product_name,
  }));

  // ======== MUTATION HANDLER ========
  const addCouponsMutation = useMutation<
    CouponsResponseType,
    AxiosError<CouponsResponseType>,
    CouponsSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/coupons",
        isServer: true,
        data: record,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Add coupons mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["coupons-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: CouponsSchemaType) => {
    addCouponsMutation.mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="gap-1 text-gray-600">
              Code<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="code"
                {...register("code")}
                placeholder="Enter Code"
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign_name" className="gap-1 text-gray-600">
              Campaign Name<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="campaign_name"
                {...register("campaign_name")}
                placeholder="Enter Campaign Name"
              />
              {errors.campaign_name && (
                <p className="text-red-500 text-sm">
                  {errors.campaign_name.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry_date" className="gap-1 text-gray-600">
              Expiry Date<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="expiry_date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        size="lg"
                        className={cn(
                          "w-full pl-3 text-left font-normal hover:!bg-transparent",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select Expiry Data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.expiry_date && (
                <p className="text-red-500 text-sm">
                  {errors.expiry_date.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="application_date" className="gap-1 text-gray-600">
              Application Date<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="application_date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        size="lg"
                        className={cn(
                          "w-full pl-3 text-left font-normal hover:!bg-transparent",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select Application Data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.application_date && (
                <p className="text-red-500 text-sm">
                  {errors.application_date.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity" className="gap-1 text-gray-600">
              Quantity<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="number"
                id="quantity"
                {...register("quantity")}
                placeholder="Enter Quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_value" className="gap-1 text-gray-600">
              Discount Value<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="number"
                step="0.01"
                id="discount_value"
                {...register("discount_value")}
                placeholder="Enter discount value"
              />
              {errors.discount_value && (
                <p className="text-red-500 text-sm">
                  {errors.discount_value.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="use_per_customer" className="gap-1 text-gray-600">
              Use Per Customer<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="number"
                id="use_per_customer"
                {...register("use_per_customer")}
                placeholder="Enter use per customer"
              />
              {errors.use_per_customer && (
                <p className="text-red-500 text-sm">
                  {errors.use_per_customer.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon_type" className="gap-1 text-gray-600">
              Coupon Type<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="coupon_type"
                control={control}
                render={({ field }) => (
                  <Select
                    options={couponTypeOptions}
                    value={couponTypeOptions.find(
                      (options) => options.value === field.value
                    )}
                    onChange={(selectedOption) =>
                      field.onChange(
                        selectedOption ? selectedOption?.value : undefined
                      )
                    }
                    placeholder="Coupon Type"
                    styles={singleSelectStyle}
                    className="w-full"
                  />
                )}
              />
              {errors.coupon_type && (
                <p className="text-red-500 text-sm">
                  {errors.coupon_type.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="products" className="gap-1 text-gray-600">
              Products<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="products"
                control={control}
                render={({ field }) => (
                  <Select
                    options={productOptions}
                    value={productOptions.filter((item) =>
                      field.value?.includes(item.value)
                    )}
                    onChange={(selectedOption) =>
                      field.onChange(
                        selectedOption
                          ? selectedOption?.map((item) => item.value)
                          : undefined
                      )
                    }
                    placeholder="Coupon Type"
                    styles={multiSelectStyle}
                    className="w-full"
                    isMulti
                  />
                )}
              />
              {errors.products && (
                <p className="text-red-500 text-sm">
                  {errors.products.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addCouponsMutation.isPending}
            >
              {addCouponsMutation.isPending ? "Submitting" : "Submit"}
              {addCouponsMutation.isPending && (
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

export default AddCouponsForm;
