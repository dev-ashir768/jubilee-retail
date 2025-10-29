import React, { useCallback } from "react";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Loader2 } from "lucide-react";
import {
  ReportingFilterSchema,
  ReportingFilterSchemaType,
} from "@/schemas/reportingFilterSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import Select from "react-select";
import { multiSelectStyle, SelectOption } from "@/utils/selectStyles";
import { AgentPayloadTypes } from "@/types/agentTypes";
import { ClientPayloadType } from "@/types/clientTypes";
import { PlanPayloadTypes } from "@/types/planTypes";
import { DevelopmentOfficerPayloadTypes } from "@/types/developmentOfficerTypes";
import { BranchPayloadType } from "@/types/branchTypes";
import { ProductsPayloadTypes } from "@/types/productsTypes";
import { ApiUsersPayloadType } from "@/types/usersTypes";

interface ReportingFormProps {
  agentList: AgentPayloadTypes[];
  planList: PlanPayloadTypes[];
  doList: DevelopmentOfficerPayloadTypes[];
  clientList: ClientPayloadType[];
  branchList: BranchPayloadType[];
  productList: ProductsPayloadTypes[];
  apiUsersList: ApiUsersPayloadType[];
}

const ReportingForm: React.FC<ReportingFormProps> = ({
  agentList,
  planList,
  doList,
  clientList,
  branchList,
  productList,
  apiUsersList,
}) => {
  // ======== SELECT OPTIONS ========
  const agentOptions = agentList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const policyStatusOptions: SelectOption[] = [
    { value: "cancelled", label: "Cancelled" },
    { value: "HISposted", label: "HISposted" },
    { value: "IGISposted", label: "IGISposted" },
    { value: "pendingIGIS", label: "pendingIGIS" },
    { value: "unverified", label: "Unverified" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
    { value: "pendingCOD", label: "pendingCOD" },
    { value: "pendingCBO", label: "pendingCBO" },
  ];

  // const dateModeOptions: SelectOption[] = [
  //   { value: "between", label: "Between" },
  //   { value: "greater", label: "Greater Than" },
  //   { value: "lesser", label: "Less Than" },
  //   { value: "exact", label: "Exact" },
  // ];

  // const amountModeOptions: SelectOption[] = [
  //   { value: "greater", label: "Greater Than" },
  //   { value: "lesser", label: "Less Than" },
  //   { value: "exact", label: "Exact" },
  // ];

  const branchOptions: SelectOption[] = branchList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const clientOptions: SelectOption[] = clientList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const doiOptions: SelectOption[] = doList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const productOptions: SelectOption[] = productList.map((item) => ({
    label: item.product_name,
    value: item.id,
  }));

  const planOptions: SelectOption[] = planList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const partnerOptions: SelectOption[] = apiUsersList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  // ======== REACT HOOK FORM ========
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(ReportingFilterSchema),
    defaultValues: {
      policy_code: "",
      agentids: null,
      branchids: null,
      clientids: null,
      coupon_code: "",
      customer_city: "",
      customer_cnic: "",
      customer_email: "",
      customer_firstname: "",
      customer_lastname: "",
      doids: null,
      order_id: null,
      partnerids: null,
      planids: null,
      policy_status: null,
      productids: null,
      tracking_number: "",
    },
  });

  // ======== MUTATIONS ========
  const reportingFiltersMutation = useMutation<ReportingFilterSchemaType>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/reportings",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      toast.error("Reporting Filters Error");
      console.log("Reporting Filters Mutation Error", err);
    },
    onSuccess: () => {
      toast.success("Reporting Filters Successful");
    },
  });

  // ======== HANDLERS ========
  const onSubmit = useCallback((data: ReportingFilterSchemaType) => {
    console.log(data);
  }, []);

  return (
    // <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
    //   <div className="space-y-6">
    //     {/* Policy Code */}
    //     <div className="space-y-2">
    //       <Label htmlFor="policy_code" className="gap-1 text-gray-600">
    //         Policy Code<span className="text-red-500 text-md">*</span>
    //       </Label>
    //       <Input
    //         type="text"
    //         id="policy_code"
    //         {...register("policy_code")}
    //         placeholder="Enter policy code"
    //       />
    //       {errors.policy_code && (
    //         <p className="text-red-500 text-sm">{errors.policy_code.message}</p>
    //       )}
    //     </div>
    //     {/* Agent */}
    //     <div className="space-y-2">
    //       <Label htmlFor="agentids">Agent</Label>
    //       <Controller
    //         name="agentids"
    //         control={control}
    //         render={({ field }) => (
    //           <Select
    //             id="product_id"
    //             options={agentOptions}
    //             value={agentOptions.filter(
    //               (opt) => (field.value || []).includes(opt.value) ?? null
    //             )}
    //             onChange={(opt) => {
    //               const values = opt?.map((item) => item.value) ?? [];
    //               return field.onChange(values.length === 0 ? null : values);
    //             }}
    //             isClearable
    //             isMulti
    //             placeholder="Select Agent"
    //             styles={multiSelectStyle}
    //             className="w-full"
    //           />
    //         )}
    //       />
    //       {errors.agentids && (
    //         <p className="text-red-500 text-sm mt-1">
    //           {errors.agentids.message}
    //         </p>
    //       )}
    //     </div>

    //     {/* Form Action */}
    //     <div>
    //       <Button
    //         type="submit"
    //         className="min-w-[150px] cursor-pointer"
    //         size="lg"
    //         disabled={reportingFiltersMutation.isPending}
    //       >
    //         {reportingFiltersMutation.isPending ? "Submiting" : "Submit"}
    //         {reportingFiltersMutation.isPending && (
    //           <span className="animate-spin">
    //             <Loader2 />
    //           </span>
    //         )}
    //       </Button>
    //     </div>
    //   </div>
    // </form>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="policy_code" className="gap-1 text-gray-600">
            Policy Code<span className="text-red-500 text-md">*</span>
          </Label>
          <Input
            type="text"
            id="policy_code"
            {...register("policy_code")}
            placeholder="Enter policy code"
          />
          {errors.policy_code && (
            <p className="text-red-500 text-sm">{errors.policy_code.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="order_id">Order ID</Label>
          <Input
            type="text"
            id="order_id"
            {...register("order_id")}
            placeholder="Enter order ID"
          />
          {errors.order_id && (
            <p className="text-red-500 text-sm">{errors.order_id.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="coupon_code">Coupon Code</Label>
          <Input
            type="text"
            id="coupon_code"
            {...register("coupon_code")}
            placeholder="Enter coupon code"
          />
          {errors.coupon_code && (
            <p className="text-red-500 text-sm">{errors.coupon_code.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tracking_number">Tracking Number</Label>
          <Input
            type="text"
            id="tracking_number"
            {...register("tracking_number")}
            placeholder="Enter tracking number"
          />
          {errors.tracking_number && (
            <p className="text-red-500 text-sm">
              {errors.tracking_number.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_firstname">First Name</Label>
          <Input
            type="text"
            id="customer_firstname"
            {...register("customer_firstname")}
            placeholder="Enter first name"
          />
          {errors.customer_firstname && (
            <p className="text-red-500 text-sm">
              {errors.customer_firstname.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_lastname">Last Name</Label>
          <Input
            type="text"
            id="customer_lastname"
            {...register("customer_lastname")}
            placeholder="Enter last name"
          />
          {errors.customer_lastname && (
            <p className="text-red-500 text-sm">
              {errors.customer_lastname.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_cnic">CNIC</Label>
          <Input
            type="text"
            id="customer_cnic"
            {...register("customer_cnic")}
            placeholder="Enter CNIC"
          />
          {errors.customer_cnic && (
            <p className="text-red-500 text-sm">
              {errors.customer_cnic.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_city">City</Label>
          <Input
            type="text"
            id="customer_city"
            {...register("customer_city")}
            placeholder="Enter city"
          />
          {errors.customer_city && (
            <p className="text-red-500 text-sm">
              {errors.customer_city.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_email">Email</Label>
          <Input
            type="email"
            id="customer_email"
            {...register("customer_email")}
            placeholder="Enter email"
          />
          {errors.customer_email && (
            <p className="text-red-500 text-sm">
              {errors.customer_email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Policy Status</Label>
          <Controller
            name="policy_status"
            control={control}
            render={({ field }) => (
              <Select
                options={policyStatusOptions}
                value={policyStatusOptions.filter((opt) =>
                  field.value?.includes(String(opt.value))
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select status"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.policy_status && (
            <p className="text-red-500 text-sm">
              {errors.policy_status.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Agents</Label>
          <Controller
            name="agentids"
            control={control}
            render={({ field }) => (
              <Select
                options={agentOptions}
                value={agentOptions.filter((opt) =>
                  field.value?.includes(opt.value)
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select agents"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.agentids && (
            <p className="text-red-500 text-sm">{errors.agentids.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Branches</Label>
          <Controller
            name="branchids"
            control={control}
            render={({ field }) => (
              <Select
                options={branchOptions}
                value={branchOptions.filter((opt) =>
                  field.value?.includes(Number(opt.value))
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select branches"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.branchids && (
            <p className="text-red-500 text-sm">{errors.branchids.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Clients</Label>
          <Controller
            name="clientids"
            control={control}
            render={({ field }) => (
              <Select
                options={clientOptions}
                value={clientOptions.filter((opt) =>
                  field.value?.includes(Number(opt.value))
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select clients"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.clientids && (
            <p className="text-red-500 text-sm">{errors.clientids.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>DOIs</Label>
          <Controller
            name="doids"
            control={control}
            render={({ field }) => (
              <Select
                options={doiOptions}
                value={doiOptions.filter((opt) =>
                  field.value?.includes(Number(opt.value))
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select DOIs"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.doids && (
            <p className="text-red-500 text-sm">{errors.doids.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Products</Label>
          <Controller
            name="productids"
            control={control}
            render={({ field }) => (
              <Select
                options={productOptions}
                value={productOptions.filter((opt) =>
                  field.value?.includes(Number(opt.value))
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select products"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.productids && (
            <p className="text-red-500 text-sm">{errors.productids.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Plans</Label>
          <Controller
            name="planids"
            control={control}
            render={({ field }) => (
              <Select
                options={planOptions}
                value={planOptions.filter((opt) =>
                  field.value?.includes(Number(opt.value))
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select plans"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.planids && (
            <p className="text-red-500 text-sm">{errors.planids.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Partners</Label>
          <Controller
            name="partnerids"
            control={control}
            render={({ field }) => (
              <Select
                options={partnerOptions}
                value={partnerOptions.filter((opt) =>
                  field.value?.includes(Number(opt.value))
                )}
                onChange={(opts) =>
                  field.onChange(opts?.map((opt) => opt.value) || [])
                }
                isMulti
                isClearable
                placeholder="Select partners"
                styles={multiSelectStyle}
              />
            )}
          />
          {errors.partnerids && (
            <p className="text-red-500 text-sm">{errors.partnerids.message}</p>
          )}
        </div>
      </div>

      {/* Form Action */}
      <div>
        <Button
          type="submit"
          className="min-w-[150px] cursor-pointer"
          size="lg"
          disabled={reportingFiltersMutation.isPending}
        >
          {reportingFiltersMutation.isPending ? (
            <>
              Submitting
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReportingForm;
