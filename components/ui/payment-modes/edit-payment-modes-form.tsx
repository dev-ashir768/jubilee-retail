"use client";

import { axiosFunction } from "@/utils/axiosFunction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Loader2 } from "lucide-react";
import {
  PaymentModeSchema,
  PaymentModeSchemaType,
} from "@/schemas/paymentModeSchema";
import {
  PaymentModesPayloadType,
  PaymentModesResponseType,
} from "@/types/paymentModesTypes";

interface EditPaymentModeFormProps {
  singlePaymentMode: PaymentModesPayloadType[];
}

const EditPaymentModeForm: React.FC<EditPaymentModeFormProps> = ({
  singlePaymentMode,
}) => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/products-plans/payment-modes";
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== REACT HOOK FORM ========
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PaymentModeSchema),
    defaultValues: {
      name: singlePaymentMode[0]?.name,
      payment_code: singlePaymentMode[0]?.payment_code,
    },
  });

  // ======== MUTATION HANDLER ========
  const editPaymentModeMutation = useMutation<
    PaymentModesResponseType,
    AxiosError<PaymentModesResponseType>,
    PaymentModeSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/payment-modes",
        isServer: true,
        data: record,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Edit payment mode mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["payment-modes-list"] });
      router.replace(LISTING_ROUTE);
    },
  });

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: PaymentModeSchemaType) => {
    editPaymentModeMutation.mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="gap-1 text-gray-600">
              Name<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="name"
                {...register("name")}
                placeholder="Enter Payment Mode Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_code" className="gap-1 text-gray-600">
              Payment Code<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="payment_code"
                {...register("payment_code")}
                placeholder="Enter Payment Mode Code"
              />
              {errors.payment_code && (
                <p className="text-red-500 text-sm">
                  {errors.payment_code.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editPaymentModeMutation.isPending}
            >
              {editPaymentModeMutation.isPending ? "Submitting" : "Submit"}
              {editPaymentModeMutation.isPending && (
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

export default EditPaymentModeForm;
