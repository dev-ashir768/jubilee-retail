"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { Button } from "../shadcn/button";
import { Label } from "../shadcn/label";
import { Controller, useForm } from "react-hook-form";
import {
  OrdersFilterSchema,
  OrdersFilterSchemaType,
} from "@/schemas/ordersFilterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/selectStyles";
import { ApiUsersPayloadType } from "@/types/usersTypes";
import { ProductsPayloadTypes } from "@/types/productsTypes";
import { BranchPayloadType } from "@/types/branchTypes";
import { PaymentModesPayloadType } from "@/types/paymentModesTypes";
import { Input } from "../shadcn/input";
import { usePathname } from "next/navigation";
import {
  initialFilterValue,
  ordersListFilterState,
} from "@/hooks/ordersListFilterState";
import { policyListFilterState } from "@/hooks/policyListFilterState";
import { renewalPolicyFilterState } from "@/hooks/renewalPolicyFilterState";
import { cboListFilterState } from "@/hooks/cboListFilterState";

interface ordersFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: () => void;
  apiUserList: ApiUsersPayloadType[];
  productList: ProductsPayloadTypes[];
  branchList: BranchPayloadType[];
  paymentModesList: PaymentModesPayloadType[];
}

const OrdersFilters: React.FC<ordersFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  apiUserList,
  productList,
  branchList,
  paymentModesList,
}) => {
  // ======== CONSTANT AND HOOKS ========
  const pathname = usePathname();
  let resetFilterValue, setFilterValue, filterValue;

  switch (pathname) {
    case "/orders/list": {
      ({ resetFilterValue, setFilterValue, filterValue } =
        ordersListFilterState());
      break;
    }

    case "/orders/policies": {
      ({ resetFilterValue, setFilterValue, filterValue } =
        policyListFilterState());
      break;
    }

    case "/orders/renewals": {
      ({ resetFilterValue, setFilterValue, filterValue } =
        renewalPolicyFilterState());
      break;
    }

    case "/orders/cbo": {
      ({ resetFilterValue, setFilterValue, filterValue } =
        cboListFilterState());
      break;
    }

    default: {
      filterValue = initialFilterValue;
      setFilterValue = setFilterValue!(initialFilterValue);
      resetFilterValue = resetFilterValue!(initialFilterValue);
      break;
    }
  }

  // ======== HOOK FORM ========
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(OrdersFilterSchema),
    defaultValues: {
      api_user_id: filterValue?.api_user_id,
      branch_id: filterValue?.branch_id,
      cnic: filterValue?.cnic,
      contact: filterValue?.contact,
      month: filterValue?.month,
      order_status: filterValue?.order_status,
      payment_mode_id: filterValue?.payment_mode_id,
      policy_status: filterValue?.policy_status,
      product_id: filterValue?.product_id,
    },
  });

  useEffect(() => {
    if (isFilterOpen) {
      reset({
        api_user_id: filterValue?.api_user_id || null,
        branch_id: filterValue?.branch_id || null,
        cnic: filterValue?.cnic || null,
        contact: filterValue?.contact || null,
        month: filterValue?.month || null,
        order_status: filterValue?.order_status || null,
        payment_mode_id: filterValue?.payment_mode_id || null,
        policy_status: filterValue?.policy_status || null,
        product_id: filterValue?.product_id || null,
      });
    }
  }, [isFilterOpen, filterValue, reset]);

  // ======== SELECT OPTIONS ========
  const monthOptions = [
    { value: "january" as const, label: "January" },
    { value: "february" as const, label: "February" },
    { value: "march" as const, label: "March" },
    { value: "april" as const, label: "April" },
    { value: "may" as const, label: "May" },
    { value: "june" as const, label: "June" },
    { value: "july" as const, label: "July" },
    { value: "august" as const, label: "August" },
    { value: "september" as const, label: "September" },
    { value: "october" as const, label: "October" },
    { value: "november" as const, label: "November" },
    { value: "december" as const, label: "December" },
  ] as const;

  const orderStatusOptions = [
    { value: "accepted" as const, label: "Accepted" },
    { value: "cancelled" as const, label: "Cancelled" },
    { value: "pendingCOD" as const, label: "PendingCOD" },
    { value: "rejected" as const, label: "Rejected" },
    { value: "unverified" as const, label: "Unverified" },
    { value: "verified" as const, label: "Verified" },
    { value: "pending" as const, label: "Pending" },
  ] as const;

  const policyStatusOptions = [
    { value: "cancelled" as const, label: "Cancelled" },
    { value: "HISposted" as const, label: "HISposted" },
    { value: "IGISposted" as const, label: "IGISposted" },
    { value: "pendingIGIS" as const, label: "pendingIGIS" },
    { value: "unverified" as const, label: "Unverified" },
    { value: "verified" as const, label: "Verified" },
    { value: "pending" as const, label: "Pending" },
    { value: "pendingCOD" as const, label: "pendingCOD" },
    { value: "pendingCBO" as const, label: "pendingCBO" },
  ] as const;

  const apiUsersOptions = apiUserList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const productsOptions = productList.map((item) => ({
    value: item.id,
    label: item.product_name,
  }));

  const branchOptions = branchList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const paymentModesOptions = paymentModesList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // ======== HANDLER ========
  const handleOnSubmit = (data: OrdersFilterSchemaType) => {
    setFilterValue(data);

    const appliedFiltersCount = Object.values(data).filter(
      (value) => value
    ).length;

    const hasAppliedFilters = appliedFiltersCount > 0;

    if (hasAppliedFilters) {
      setIsFilterOpen();
    }
  };

  const handleOnReset = () => {
    reset({
      api_user_id: null,
      branch_id: null,
      cnic: null,
      contact: null,
      month: null,
      order_status: null,
      payment_mode_id: null,
      policy_status: null,
      product_id: null,
    });
    resetFilterValue();
    setIsFilterOpen();
    console.log("filterValue", filterValue);
  };

  return (
    <>
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[660px] gap-6">
          <DialogHeader>
            <DialogTitle>Apply Filter</DialogTitle>
            <DialogDescription>
              Select a your desired filter from below.
            </DialogDescription>
          </DialogHeader>
          <form id="orders-filter" onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Status */} {/* Policy Status */}
              {pathname === "/orders/list" ? (
                <div className="space-y-2">
                  <Label htmlFor="order_status">Order Status</Label>
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="order_status"
                      render={({ field }) => (
                        <Select
                          key={`order_status-${
                            (field.value || []).join(",") || "empty"
                          }`}
                          id="order_status"
                          options={orderStatusOptions}
                          value={orderStatusOptions.filter((opt) =>
                            (field.value || []).includes(opt.value)
                          )}
                          onChange={(opt) => {
                            const values = opt?.map((item) => item.value) ?? [];
                            return field.onChange(
                              values.length === 0 ? null : values
                            );
                          }}
                          styles={multiSelectStyle}
                          placeholder="Select Order Status"
                          isClearable
                          isMulti
                          className="w-full"
                        />
                      )}
                    />
                    {errors.order_status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.order_status.message}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="policy_status">Policy Status</Label>
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="policy_status"
                      render={({ field }) => (
                        <Select
                          key={`policy_status-${field.value ?? "empty"}`}
                          id="policy_status"
                          options={policyStatusOptions}
                          value={policyStatusOptions.filter((opt) =>
                            (field.value || []).includes(opt.value)
                          )}
                          onChange={(opt) => {
                            const values = opt?.map((item) => item.value) ?? [];
                            return field.onChange(
                              values.length === 0 ? null : values
                            );
                          }}
                          styles={multiSelectStyle}
                          placeholder="Select Policy Status"
                          isClearable
                          isMulti
                          className="w-full"
                        />
                      )}
                    />
                    {errors.policy_status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.policy_status.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* API User */}
              <div className="space-y-2">
                <Label htmlFor="api_user_id">API User</Label>
                <Controller
                  name="api_user_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="api_user_id"
                      options={apiUsersOptions}
                      value={apiUsersOptions.filter(
                        (opt) => (field.value || []).includes(opt.value) ?? null
                      )}
                      onChange={(opt) => {
                        const values = opt?.map((item) => item.value) ?? [];
                        return field.onChange(
                          values.length === 0 ? null : values
                        );
                      }}
                      isClearable
                      isMulti
                      placeholder="Select API User"
                      styles={multiSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.api_user_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.api_user_id.message}
                  </p>
                )}
              </div>
              {/* Product */}
              <div className="space-y-2">
                <Label htmlFor="product_id">Product</Label>
                <Controller
                  name="product_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="product_id"
                      options={productsOptions}
                      value={productsOptions.filter(
                        (opt) => (field.value || []).includes(opt.value) ?? null
                      )}
                      onChange={(opt) => {
                        const values = opt?.map((item) => item.value) ?? [];
                        return field.onChange(
                          values.length === 0 ? null : values
                        );
                      }}
                      isClearable
                      isMulti
                      placeholder="Select Product"
                      styles={multiSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.product_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.product_id.message}
                  </p>
                )}
              </div>
              {/* Branch */}
              <div className="space-y-2">
                <Label htmlFor="branch_id">Branch</Label>
                <Controller
                  name="branch_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="branch_id"
                      options={branchOptions}
                      value={branchOptions.filter((opt) =>
                        (field.value || []).includes(opt.value)
                      )}
                      onChange={(opt) => {
                        const values = opt?.map((item) => item.value) ?? [];
                        return field.onChange(
                          values.length === 0 ? null : values
                        );
                      }}
                      isClearable
                      isMulti
                      placeholder="Select Branch"
                      styles={multiSelectStyle}
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
              {/* Payment Mode */}
              <div className="space-y-2">
                <Label htmlFor="payment_mode_id">Payment Mode</Label>
                <Controller
                  name="payment_mode_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="payment_mode_id"
                      options={paymentModesOptions}
                      value={paymentModesOptions.filter((opt) =>
                        (field.value || []).includes(opt.value)
                      )}
                      onChange={(opt) => {
                        const values = opt?.map((item) => item.value) ?? [];
                        return field.onChange(
                          values.length === 0 ? null : values
                        );
                      }}
                      isClearable
                      isMulti
                      placeholder="Select Payment Mode"
                      styles={multiSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.payment_mode_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.payment_mode_id.message}
                  </p>
                )}
              </div>
              {/* Month */}
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="month"
                    render={({ field }) => (
                      <Select
                        id="month"
                        key={`month-${field.value ?? "empty"}`}
                        options={monthOptions}
                        value={
                          monthOptions.filter((opt) =>
                            (field.value || []).includes(opt.value)
                          ) ?? null
                        }
                        onChange={(opt) => {
                          const values = opt?.map((item) => item.value) ?? [];
                          return field.onChange(
                            values.length === 0 ? null : values
                          );
                        }}
                        styles={multiSelectStyle}
                        isClearable
                        placeholder="Select Month"
                        className="w-full"
                        isMulti
                      />
                    )}
                  />
                  {errors.month && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.month.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Cnic */}
              <div className="space-y-2">
                <Label htmlFor="cnic">Cnic</Label>
                <Input
                  id="cnic"
                  type="number"
                  {...register("cnic")}
                  className="w-full"
                  placeholder="Enter Cnic"
                />
                {errors.cnic && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cnic.message}
                  </p>
                )}
              </div>
              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  type="number"
                  {...register("contact")}
                  className="w-full"
                  placeholder="Enter Contact"
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contact.message}
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
              form="orders-filter"
            >
              Apply
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="min-w-[150px] cursor-pointer"
              onClick={handleOnReset}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersFilters;
