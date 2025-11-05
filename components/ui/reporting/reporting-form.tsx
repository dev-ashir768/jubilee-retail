"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Switch } from "../shadcn/switch";
import { Loader2 } from "lucide-react";
import {
  ReportingFilterSchema,
  ReportingFilterSchemaType,
} from "@/schemas/reportingFilterSchema";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import Select from "react-select";
import {
  multiSelectStyle,
  SelectOption,
  singleSelectStyle,
} from "@/utils/selectStyles";
import { AgentPayloadTypes } from "@/types/agentTypes";
import { ClientPayloadType } from "@/types/clientTypes";
import { PlanPayloadTypes } from "@/types/planTypes";
import { DevelopmentOfficerPayloadTypes } from "@/types/developmentOfficerTypes";
import { BranchPayloadType } from "@/types/branchTypes";
import { ProductsPayloadTypes } from "@/types/productsTypes";
import { ApiUsersPayloadType } from "@/types/usersTypes";
import { CityPayloadType } from "@/types/cityTypes";
import { CouponsPayloadType } from "@/types/couponsTypes";
import { ReportingFiltersResponseType } from "@/types/reportingFiltersType";
import { AxiosError } from "axios";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { DateRangePicker } from "../foundations/date-range-picker";
import { DatePicker } from "../foundations/date-picker";

interface ReportingFormProps {
  agentList: AgentPayloadTypes[];
  planList: PlanPayloadTypes[];
  doList: DevelopmentOfficerPayloadTypes[];
  clientList: ClientPayloadType[];
  branchList: BranchPayloadType[];
  productList: ProductsPayloadTypes[];
  apiUsersList: ApiUsersPayloadType[];
  cityList: CityPayloadType[];
  couponList: CouponsPayloadType[];
}

const ReportingForm: React.FC<ReportingFormProps> = ({
  agentList,
  planList,
  doList,
  clientList,
  cityList,
  branchList,
  productList,
  apiUsersList,
  couponList,
}) => {
  // ======== TOGGLE STATES ========
  const [issueDateEnabled, setIssueDateEnabled] = useState(false);
  const [startDateEnabled, setStartDateEnabled] = useState(false);
  const [expiryDateEnabled, setExpiryDateEnabled] = useState(false);
  const [modifiedDateEnabled, setModifiedDateEnabled] = useState(false);
  const [amountAssuredEnabled, setAmountAssuredEnabled] = useState(false);
  const defaultDaysBack = 366;

  // ======== STATES FOR ISSUE DATE ========
  const [issueDateRange, setIssueDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), defaultDaysBack),
    to: new Date(),
  });
  const [issueSingleDate, setIssueSingleDate] = useState<Date | undefined>(
    new Date()
  );

  // ======== STATES FOR START DATE ========
  const [startDateRange, setStartDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), defaultDaysBack),
    to: new Date(),
  });
  const [startSingleDate, setStartSingleDate] = useState<Date | undefined>(
    new Date()
  );

  // ======== STATES FOR EXPIRY DATE ========
  const [expiryDateRange, setExpiryDateRange] = useState<DateRange | undefined>(
    {
      from: subDays(new Date(), defaultDaysBack),
      to: new Date(),
    }
  );
  const [expirySingleDate, setExpirySingleDate] = useState<Date | undefined>(
    new Date()
  );

  // ======== STATES FOR MODIFIED DATE ========
  const [modifiedDateRange, setModifiedDateRange] = useState<
    DateRange | undefined
  >({
    from: subDays(new Date(), defaultDaysBack),
    to: new Date(),
  });
  const [modifiedSingleDate, setModifiedSingleDate] = useState<
    Date | undefined
  >(new Date());

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

  const couponOptions: SelectOption[] = couponList.map((item) => ({
    label: item?.code,
    value: item?.code,
  }));

  const cityOptions: SelectOption[] = cityList.map((item) => ({
    label: item?.city_name,
    value: item?.city_name,
  }));

  const dateModeOptions: SelectOption[] = [
    { value: "between", label: "Between" },
    { value: "greater", label: "Greater Than" },
    { value: "lesser", label: "Less Than" },
  ];

  const amountModeOptions: SelectOption[] = [
    { value: "greater", label: "Greater Than" },
    { value: "lesser", label: "Less Than" },
    { value: "exact", label: "Exact" },
  ];

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
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(ReportingFilterSchema),
    mode: "onChange",
    defaultValues: {
      policy_code: null,
      agentids: null,
      branchids: null,
      clientids: null,
      coupon_code: null,
      customer_city: null,
      customer_cnic: null,
      customer_email: null,
      customer_firstname: null,
      customer_lastname: null,
      doids: null,
      order_id: null,
      partnerids: null,
      planids: null,
      policy_status: null,
      productids: null,
      tracking_number: null,
      issue_date: null,
      start_date: null,
      expiry_date: null,
      modified_date: null,
      amount_assured: null,
    },
  });

  const formData = useWatch({ control });

  // Check if form has any data
  const hasFormData = useMemo(() => {
    return Object.values(formData).some((val) => {
      if (val === null || val === undefined) return false;
      if (typeof val === "string") return val.trim() !== "";
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "object" && val !== null) {
        return Object.values(val).some((v) => v != null && v !== "");
      }
      return true;
    });
  }, [formData]);

  // Watch modes for each date field
  const issueDateMode = watch("issue_date.mode");
  const startDateMode = watch("start_date.mode");
  const expiryDateMode = watch("expiry_date.mode");
  const modifiedDateMode = watch("modified_date.mode");

  // ======== USE EFFECTS FOR TOGGLES ========
  useEffect(() => {
    if (!issueDateEnabled) {
      setValue("issue_date", null);
    }
  }, [issueDateEnabled, setValue]);

  useEffect(() => {
    if (!startDateEnabled) {
      setValue("start_date", null);
    }
  }, [startDateEnabled, setValue]);

  useEffect(() => {
    if (!expiryDateEnabled) {
      setValue("expiry_date", null);
    }
  }, [expiryDateEnabled, setValue]);

  useEffect(() => {
    if (!modifiedDateEnabled) {
      setValue("modified_date", null);
    }
  }, [modifiedDateEnabled, setValue]);

  useEffect(() => {
    if (!amountAssuredEnabled) {
      setValue("amount_assured", null);
    }
  }, [amountAssuredEnabled, setValue]);

  // ======== USE EFFECTS FOR EACH DATE FIELD ========

  // Issue Date Sync
  useEffect(() => {
    if (!issueDateEnabled) return;
    let formatted: string | null = null;
    if (issueDateMode === "between" && issueDateRange) {
      const from = issueDateRange.from
        ? format(issueDateRange.from, "yyyy-MM-dd")
        : "";
      const to = issueDateRange.to
        ? format(issueDateRange.to, "yyyy-MM-dd")
        : "";
      formatted = from && to ? `${from} to ${to}` : null;
    } else if (
      (issueDateMode === "greater" || issueDateMode === "lesser") &&
      issueSingleDate
    ) {
      formatted = format(issueSingleDate, "yyyy-MM-dd");
    }
    setValue("issue_date.date", formatted);
    setValue("issue_date.mode", issueDateMode || "between");
  }, [
    issueDateRange,
    issueSingleDate,
    issueDateMode,
    setValue,
    issueDateEnabled,
  ]);

  // Start Date Sync
  useEffect(() => {
    if (!startDateEnabled) return;
    let formatted: string | null = null;
    if (startDateMode === "between" && startDateRange) {
      const from = startDateRange.from
        ? format(startDateRange.from, "yyyy-MM-dd")
        : "";
      const to = startDateRange.to
        ? format(startDateRange.to, "yyyy-MM-dd")
        : "";
      formatted = from && to ? `${from} to ${to}` : null;
    } else if (
      (startDateMode === "greater" || startDateMode === "lesser") &&
      startSingleDate
    ) {
      formatted = format(startSingleDate, "yyyy-MM-dd");
    }
    setValue("start_date.date", formatted);
    setValue("start_date.mode", startDateMode || "between");
  }, [
    startDateRange,
    startSingleDate,
    startDateMode,
    setValue,
    startDateEnabled,
  ]);

  // Expiry Date Sync
  useEffect(() => {
    if (!expiryDateEnabled) return;
    let formatted: string | null = null;
    if (expiryDateMode === "between" && expiryDateRange) {
      const from = expiryDateRange.from
        ? format(expiryDateRange.from, "yyyy-MM-dd")
        : "";
      const to = expiryDateRange.to
        ? format(expiryDateRange.to, "yyyy-MM-dd")
        : "";
      formatted = from && to ? `${from} to ${to}` : null;
    } else if (
      (expiryDateMode === "greater" || expiryDateMode === "lesser") &&
      expirySingleDate
    ) {
      formatted = format(expirySingleDate, "yyyy-MM-dd");
    }
    setValue("expiry_date.date", formatted);
    setValue("expiry_date.mode", expiryDateMode || "between");
  }, [
    expiryDateRange,
    expirySingleDate,
    expiryDateMode,
    setValue,
    expiryDateEnabled,
  ]);

  // Modified Date Sync
  useEffect(() => {
    if (!modifiedDateEnabled) return;
    let formatted: string | null = null;
    if (modifiedDateMode === "between" && modifiedDateRange) {
      const from = modifiedDateRange.from
        ? format(modifiedDateRange.from, "yyyy-MM-dd")
        : "";
      const to = modifiedDateRange.to
        ? format(modifiedDateRange.to, "yyyy-MM-dd")
        : "";
      formatted = from && to ? `${from} to ${to}` : null;
    } else if (
      (modifiedDateMode === "greater" || modifiedDateMode === "lesser") &&
      modifiedSingleDate
    ) {
      formatted = format(modifiedSingleDate, "yyyy-MM-dd");
    }
    setValue("modified_date.date", formatted);
    setValue("modified_date.mode", modifiedDateMode || "between");
  }, [
    modifiedDateRange,
    modifiedSingleDate,
    modifiedDateMode,
    setValue,
    modifiedDateEnabled,
  ]);

  // ======== MUTATIONS ========
  const reportingFiltersMutation = useMutation<
    Blob,
    AxiosError<ReportingFiltersResponseType>,
    ReportingFilterSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/reportings",
        data: record,
        isServer: true,
        responseType: "blob",
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Reporting Filetrs mutation handler", err);
    },
    onSuccess: (blobData: Blob) => {
      const url = URL.createObjectURL(blobData);
      console.log("Created URL:", url);

      const a = document.createElement("a");
      a.href = url;
      a.download = `reporting-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);

      // Trigger download
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Reporting Filters downloaded successfully");
    },
  });

  // ======== HANDLERS ========
  const onSubmit = useCallback(
    (data: ReportingFilterSchemaType) => {
      reportingFiltersMutation.mutate(data);
    },
    [reportingFiltersMutation]
  );

  // ======== RENDER PICKERS FOR EACH FIELD ========
  const renderIssuePicker = () => {
    if (issueDateMode === "between") {
      return (
        <DateRangePicker
          defaultDaysBack={defaultDaysBack}
          date={issueDateRange}
          setDate={(newRange) => {
            setIssueDateRange(newRange);
            if (newRange) {
              const from = newRange.from
                ? format(newRange.from, "yyyy-MM-dd")
                : "";
              const to = newRange.to ? format(newRange.to, "yyyy-MM-dd") : "";
              const formatted = from && to ? `${from} to ${to}` : null;
              setValue("issue_date.date", formatted);
            }
          }}
        />
      );
    } else {
      return (
        <DatePicker
          date={issueSingleDate}
          setDate={(newDate) => {
            setIssueSingleDate(newDate);
            if (newDate) {
              const formatted = format(newDate, "yyyy-MM-dd");
              setValue("issue_date.date", formatted);
            } else {
              setValue("issue_date.date", null);
            }
          }}
        />
      );
    }
  };

  const renderStartPicker = () => {
    if (startDateMode === "between") {
      return (
        <DateRangePicker
          defaultDaysBack={defaultDaysBack}
          date={startDateRange}
          setDate={(newRange) => {
            setStartDateRange(newRange);
            if (newRange) {
              const from = newRange.from
                ? format(newRange.from, "yyyy-MM-dd")
                : "";
              const to = newRange.to ? format(newRange.to, "yyyy-MM-dd") : "";
              const formatted = from && to ? `${from} to ${to}` : null;
              setValue("start_date.date", formatted);
            }
          }}
        />
      );
    } else {
      return (
        <DatePicker
          date={startSingleDate}
          setDate={(newDate) => {
            setStartSingleDate(newDate);
            if (newDate) {
              const formatted = format(newDate, "yyyy-MM-dd");
              setValue("start_date.date", formatted);
            } else {
              setValue("start_date.date", null);
            }
          }}
        />
      );
    }
  };

  const renderExpiryPicker = () => {
    if (expiryDateMode === "between") {
      return (
        <DateRangePicker
          defaultDaysBack={defaultDaysBack}
          date={expiryDateRange}
          setDate={(newRange) => {
            setExpiryDateRange(newRange);
            if (newRange) {
              const from = newRange.from
                ? format(newRange.from, "yyyy-MM-dd")
                : "";
              const to = newRange.to ? format(newRange.to, "yyyy-MM-dd") : "";
              const formatted = from && to ? `${from} to ${to}` : null;
              setValue("expiry_date.date", formatted);
            }
          }}
        />
      );
    } else {
      return (
        <DatePicker
          date={expirySingleDate}
          setDate={(newDate) => {
            setExpirySingleDate(newDate);
            if (newDate) {
              const formatted = format(newDate, "yyyy-MM-dd");
              setValue("expiry_date.date", formatted);
            } else {
              setValue("expiry_date.date", null);
            }
          }}
        />
      );
    }
  };

  const renderModifiedPicker = () => {
    if (modifiedDateMode === "between") {
      return (
        <DateRangePicker
          defaultDaysBack={defaultDaysBack}
          date={modifiedDateRange}
          setDate={(newRange) => {
            setModifiedDateRange(newRange);
            if (newRange) {
              const from = newRange.from
                ? format(newRange.from, "yyyy-MM-dd")
                : "";
              const to = newRange.to ? format(newRange.to, "yyyy-MM-dd") : "";
              const formatted = from && to ? `${from} to ${to}` : null;
              setValue("modified_date.date", formatted);
            }
          }}
        />
      );
    } else {
      return (
        <DatePicker
          date={modifiedSingleDate}
          setDate={(newDate) => {
            setModifiedSingleDate(newDate);
            if (newDate) {
              const formatted = format(newDate, "yyyy-MM-dd");
              setValue("modified_date.date", formatted);
            } else {
              setValue("modified_date.date", null);
            }
          }}
        />
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="lg:w-1/2 w-full space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="policy_code">Policy Code</Label>
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
          <p className="text-red-500 text-sm">{errors.customer_cnic.message}</p>
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
        <Label htmlFor="coupon_code">Coupon Code</Label>
        <Controller
          name="coupon_code"
          control={control}
          render={({ field }) => (
            <Select
              options={couponOptions}
              value={
                couponOptions.find((opt) => opt?.value === field.value) ?? null
              }
              onChange={(opt) => field.onChange(opt?.value ?? null)}
              className="w-full"
              isClearable
              placeholder="Select Coupon Code"
              styles={singleSelectStyle}
            />
          )}
        />
        {errors.coupon_code && (
          <p className="text-red-500 text-sm">{errors.coupon_code.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="customer_city">City</Label>
        <Controller
          name="customer_city"
          control={control}
          render={({ field }) => (
            <Select
              options={cityOptions}
              value={
                cityOptions.find((opt) => opt?.value === field.value) ?? null
              }
              onChange={(opt) => field.onChange(opt?.value) ?? null}
              className="w-full"
              isClearable
              placeholder="Select City"
              styles={singleSelectStyle}
            />
          )}
        />
        {errors.customer_city && (
          <p className="text-red-500 text-sm">{errors.customer_city.message}</p>
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
          <p className="text-red-500 text-sm">{errors.policy_status.message}</p>
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Issue Date</Label>
          <Switch
            checked={issueDateEnabled}
            onCheckedChange={setIssueDateEnabled}
          />
        </div>
        {issueDateEnabled && (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="space-y-2">
              {renderIssuePicker()}
              {errors.issue_date?.date && (
                <p className="text-red-500 text-sm">
                  {errors.issue_date.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Controller
                name="issue_date.mode"
                control={control}
                render={({ field }) => (
                  <Select
                    options={dateModeOptions}
                    value={
                      dateModeOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(opt) => {
                      field.onChange(opt?.value || null);
                      // Reset dates on mode change
                      if (opt?.value !== "between") {
                        setIssueDateRange(undefined);
                        setValue("issue_date.date", null);
                      } else {
                        setIssueSingleDate(undefined);
                      }
                    }}
                    placeholder="Select Mode"
                    styles={singleSelectStyle}
                  />
                )}
              />
              {errors.issue_date?.mode && (
                <p className="text-red-500 text-sm">
                  {errors.issue_date.mode.message}
                </p>
              )}
            </div>
          </div>
        )}
        {errors.issue_date &&
          !errors.issue_date.date &&
          !errors.issue_date.mode && (
            <p className="text-red-500 text-sm">{errors.issue_date.message}</p>
          )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Start Date</Label>
          <Switch
            checked={startDateEnabled}
            onCheckedChange={setStartDateEnabled}
          />
        </div>
        {startDateEnabled && (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="space-y-2">
              {renderStartPicker()}
              {errors.start_date?.date && (
                <p className="text-red-500 text-sm">
                  {errors.start_date.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Controller
                name="start_date.mode"
                control={control}
                render={({ field }) => (
                  <Select
                    options={dateModeOptions}
                    value={
                      dateModeOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(opt) => {
                      field.onChange(opt?.value || null);
                      // Reset dates on mode change
                      if (opt?.value !== "between") {
                        setStartDateRange(undefined);
                        setValue("start_date.date", null);
                      } else {
                        setStartSingleDate(undefined);
                      }
                    }}
                    placeholder="Select Mode"
                    styles={singleSelectStyle}
                  />
                )}
              />
              {errors.start_date?.mode && (
                <p className="text-red-500 text-sm">
                  {errors.start_date.mode.message}
                </p>
              )}
            </div>
          </div>
        )}
        {errors.start_date &&
          !errors.start_date.date &&
          !errors.start_date.mode && (
            <p className="text-red-500 text-sm">{errors.start_date.message}</p>
          )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Expiry Date</Label>
          <Switch
            checked={expiryDateEnabled}
            onCheckedChange={setExpiryDateEnabled}
          />
        </div>
        {expiryDateEnabled && (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="space-y-2">
              {renderExpiryPicker()}
              {errors.expiry_date?.date && (
                <p className="text-red-500 text-sm">
                  {errors.expiry_date.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Controller
                name="expiry_date.mode"
                control={control}
                render={({ field }) => (
                  <Select
                    options={dateModeOptions}
                    value={
                      dateModeOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(opt) => {
                      field.onChange(opt?.value || null);
                      // Reset dates on mode change
                      if (opt?.value !== "between") {
                        setExpiryDateRange(undefined);
                        setValue("expiry_date.date", null);
                      } else {
                        setExpirySingleDate(undefined);
                      }
                    }}
                    placeholder="Select Mode"
                    styles={singleSelectStyle}
                  />
                )}
              />
              {errors.expiry_date?.mode && (
                <p className="text-red-500 text-sm">
                  {errors.expiry_date.mode.message}
                </p>
              )}
            </div>
          </div>
        )}
        {errors.expiry_date &&
          !errors.expiry_date.date &&
          !errors.expiry_date.mode && (
            <p className="text-red-500 text-sm">{errors.expiry_date.message}</p>
          )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Modified Date</Label>
          <Switch
            checked={modifiedDateEnabled}
            onCheckedChange={setModifiedDateEnabled}
          />
        </div>
        {modifiedDateEnabled && (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="space-y-2">
              {renderModifiedPicker()}
              {errors.modified_date?.date && (
                <p className="text-red-500 text-sm">
                  {errors.modified_date.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Controller
                name="modified_date.mode"
                control={control}
                render={({ field }) => (
                  <Select
                    options={dateModeOptions}
                    value={
                      dateModeOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(opt) => {
                      field.onChange(opt?.value || null);
                      if (opt?.value !== "between") {
                        setModifiedDateRange(undefined);
                        setValue("modified_date.date", null);
                      } else {
                        setModifiedSingleDate(undefined);
                      }
                    }}
                    placeholder="Select Mode"
                    styles={singleSelectStyle}
                  />
                )}
              />
              {errors.modified_date?.mode && (
                <p className="text-red-500 text-sm">
                  {errors.modified_date.mode.message}
                </p>
              )}
            </div>
          </div>
        )}
        {errors.modified_date &&
          !errors.modified_date.date &&
          !errors.modified_date.mode && (
            <p className="text-red-500 text-sm">
              {errors.modified_date.message}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Amount Assured</Label>
          <Switch
            checked={amountAssuredEnabled}
            onCheckedChange={setAmountAssuredEnabled}
          />
        </div>
        {amountAssuredEnabled && (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <div className="space-y-2">
              <Input
                type="text"
                id="amount_assured_amount"
                {...register("amount_assured.amount")}
                placeholder="Enter amount"
              />
              {errors.amount_assured?.amount && (
                <p className="text-red-500 text-sm">
                  {errors.amount_assured.amount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Controller
                name="amount_assured.mode"
                control={control}
                render={({ field }) => (
                  <Select
                    options={amountModeOptions}
                    value={
                      amountModeOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                    onChange={(opt) => field.onChange(opt?.value || null)}
                    placeholder="Select Mode"
                    styles={singleSelectStyle}
                  />
                )}
              />
              {errors.amount_assured?.mode && (
                <p className="text-red-500 text-sm">
                  {errors.amount_assured.mode.message}
                </p>
              )}
            </div>
          </div>
        )}
        {errors.amount_assured &&
          !errors.amount_assured.amount &&
          !errors.amount_assured.mode && (
            <p className="text-red-500 text-sm">
              {errors.amount_assured.message}
            </p>
          )}
      </div>

      {/* Form Action */}
      <div>
        <Button
          type="submit"
          className="min-w-[150px] cursor-pointer"
          size="lg"
          disabled={reportingFiltersMutation.isPending || !hasFormData}
        >
          {reportingFiltersMutation.isPending ? (
            <>
              Downloading...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Downloading Report"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReportingForm;
