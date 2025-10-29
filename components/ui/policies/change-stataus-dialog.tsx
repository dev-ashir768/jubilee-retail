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
import {
  PolicyStatusSchema,
  PolicyStatusSchemaType,
} from "@/schemas/policyStatusSchema";
import { BranchPayloadType } from "@/types/branchTypes";
import { singleSelectStyle } from "@/utils/selectStyles";
import { AgentPayloadTypes } from "@/types/agentTypes";
import { ClientPayloadType } from "@/types/clientTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PolicyStatusResponseType } from "@/types/policyStatusTypes";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { policyListFilterState } from "@/hooks/policyListFilterState";

interface ChangeStatusDialogProps {
  statusDialogOpen: boolean;
  setStatusDialogOpen: (statusDialogOpen: boolean) => void;
  branchList: BranchPayloadType[];
  agentList: AgentPayloadTypes[];
  clientList: ClientPayloadType[];
  policyId?: number;
  startDate: string | null;
  endDate: string | null;
}

interface BranchOption {
  value: number;
  label: string;
}

interface AgentOption {
  value: number;
  label: string;
}

interface ClientOption {
  value: number;
  label: string;
}

interface PolicyStatusOption {
  value: string;
  label: string;
}

const ChangeStatusDialog: React.FC<ChangeStatusDialogProps> = ({
  statusDialogOpen,
  setStatusDialogOpen,
  branchList,
  agentList,
  clientList,
  policyId,
  startDate,
  endDate
}) => {
  const queryClient = useQueryClient();
  const { filterValue } = policyListFilterState();
  // ======== SELECT OPTIONS ========
  const branchOptions: BranchOption[] = branchList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const agentOptions: AgentOption[] = agentList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const clientOptions: ClientOption[] = clientList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const policyStatusOptions: PolicyStatusOption[] = [
    { value: "cancelled", label: "Cancelled" },
    { value: "IGISposted", label: "IGISPosted" },
  ];

  // ======== HOOK FORM ========
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(PolicyStatusSchema),
    defaultValues: {
      branch_id: undefined,
      agent_id: undefined,
      client_id: undefined,
      status: "",
    },
  });

  // ======== MUTATION ========
  const updatePolicyStatusMutation = useMutation<
    PolicyStatusResponseType,
    AxiosError<PolicyStatusResponseType>,
    PolicyStatusSchemaType
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
      toast.success("Updating policy status...");
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Updating policy status mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: [
          "policies-list",
          ...(startDate && endDate ? [`${startDate} to ${endDate}`] : []),
          ...(filterValue?.month ? [filterValue.month] : []),
          ...(filterValue?.policy_status ? [filterValue.policy_status] : []),
          ...(filterValue?.contact ? [filterValue.contact] : []),
          ...(filterValue?.api_user_id ? [filterValue.api_user_id] : []),
          ...(filterValue?.branch_id ? [filterValue.branch_id] : []),
          ...(filterValue?.payment_mode_id
            ? [filterValue.payment_mode_id]
            : []),
          ...(filterValue?.product_id ? [filterValue.product_id] : []),
          ...(filterValue?.cnic ? [filterValue.cnic] : []),
        ],
      });
      setStatusDialogOpen(false);
      reset();
    },
  });

  // ======== HANDLER ========
  const handleOnSubmit = (data: PolicyStatusSchemaType) => {
    updatePolicyStatusMutation.mutate(data);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch */}
              <div className="space-y-2">
                <Label htmlFor="branch_id">
                  Branch <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="branch_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="branch_id"
                      options={branchOptions}
                      value={
                        branchOptions.find(
                          (opt) => opt.value === field.value
                        ) ?? null
                      }
                      onChange={(selectedVal) =>
                        field.onChange(selectedVal ? selectedVal.value : null)
                      }
                      placeholder="Select Branch"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.branch_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.branch_id.message}
                  </p>
                )}
              </div>
              {/* Agent */}
              <div className="space-y-2">
                <Label htmlFor="agent_id">
                  Agent <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="agent_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="branch_id"
                      options={agentOptions}
                      value={
                        agentOptions.find((opt) => opt.value === field.value) ??
                        undefined
                      }
                      onChange={(selectedVal) =>
                        field.onChange(
                          selectedVal ? selectedVal.value : undefined
                        )
                      }
                      placeholder="Select Agent"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.agent_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.agent_id.message}
                  </p>
                )}
              </div>
              {/* Client */}
              <div className="space-y-2">
                <Label htmlFor="client_id">
                  Client <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="client_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="client_id"
                      options={clientOptions}
                      value={
                        clientOptions.find(
                          (opt) => opt.value === field.value
                        ) ?? undefined
                      }
                      onChange={(selectedVal) =>
                        field.onChange(
                          selectedVal ? selectedVal.value : undefined
                        )
                      }
                      placeholder="Select Client"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.client_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.client_id.message}
                  </p>
                )}
              </div>
              {/* Cancelled || IGISposted */}
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

export default ChangeStatusDialog;
