import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { Button } from "../shadcn/button";
import { Label } from "../shadcn/label";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { singleSelectStyle } from "@/utils/selectStyles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PolicyStatusResponseType } from "@/types/policyStatusTypes";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import {
  CBOCBOPolicyStatusSchemaType,
  CBOPolicyStatusSchema,
} from "@/schemas/cboPolicyStatusSchema";
import { cboListFilterState } from "@/hooks/cboListFilterState";

interface ChangeCBOPolicyStatusProps {
  statusDialogOpen: boolean;
  setStatusDialogOpen: (statusDialogOpen: boolean) => void;
  policyId?: number;
  startDate: string | null;
  endDate: string | null;
}

interface PolicyStatusOption {
  value: string;
  label: string;
}

const ChangeCBOPolicyStatus: React.FC<ChangeCBOPolicyStatusProps> = ({
  statusDialogOpen,
  setStatusDialogOpen,
  policyId,
  startDate,
  endDate,
}) => {
  const queryClient = useQueryClient();
  const { filterValue } = cboListFilterState();
  // ======== SELECT OPTIONS ========
  const policyStatusOptions: PolicyStatusOption[] = [
    { value: "cancelled", label: "Cancelled" },
    { value: "HISposted", label: "HISposted" },
  ];

  // ======== HOOK FORM ========
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(CBOPolicyStatusSchema),
    defaultValues: {
      status: "",
    },
  });

  // ======== MUTATION ========
  const updateCBOPolicyStatusMutation = useMutation<
    PolicyStatusResponseType,
    AxiosError<PolicyStatusResponseType>,
    CBOCBOPolicyStatusSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: `/orders/status`,
        data: { ...record, policy_id: policyId! },
        isServer: true,
      });
    },
    onMutate: () => {
      toast.success("Updating cbo policy status...");
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Updating cbo policy status mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);

      const invalidationKey = [
        "cbo-list",
        ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
        ...(filterValue?.month ? [filterValue.month] : []),
        ...(filterValue?.policy_status ? [filterValue.policy_status] : []),
        ...(filterValue?.contact ? [filterValue.contact] : []),
        ...(filterValue?.api_user_id ? [filterValue.api_user_id] : []),
        ...(filterValue?.branch_id ? [filterValue.branch_id] : []),
        ...(filterValue?.payment_mode_id ? [filterValue.payment_mode_id] : []),
        ...(filterValue?.product_id ? [filterValue.product_id] : []),
        ...(filterValue?.cnic ? [filterValue.cnic] : []),
      ];

      queryClient.invalidateQueries({
        queryKey: invalidationKey,
      });
      
      setStatusDialogOpen(false);
      reset();
    },
  });

  // ======== HANDLER ========
  const handleOnSubmit = (data: CBOCBOPolicyStatusSchemaType) => {
    updateCBOPolicyStatusMutation.mutate(data);
  };

  return (
    <>
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[660px] gap-6">
          <DialogHeader>
            <DialogTitle>Status Change</DialogTitle>
            <DialogDescription>
              Select a options to change policy status.
            </DialogDescription>
          </DialogHeader>
          <form
            id="policy-status-change"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className="grid grid-cols-1">
              {/* Cancelled || HISposted */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Policy Status <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="status"
                      options={policyStatusOptions}
                      value={
                        policyStatusOptions.find(
                          (opt) => opt.value === field.value
                        ) ?? undefined
                      }
                      onChange={(selectedVal) =>
                        field.onChange(
                          selectedVal ? selectedVal.value : undefined
                        )
                      }
                      placeholder="Select Policy Status"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </form>
          <DialogFooter className="sm:justify-center gap-4">
            <Button
              size="lg"
              type="submit"
              className="min-w-[150px] cursor-pointer"
              form="policy-status-change"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeCBOPolicyStatus;
