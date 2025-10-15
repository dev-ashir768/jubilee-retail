"use client";

import React from "react";
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
  OrdersListFilterSchema,
  OrdersListFilterSchemaType,
} from "@/schemas/ordersListFilterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { singleSelectStyle } from "@/utils/selectStyles";
import { OrdersListFilterStore } from "@/hooks/ordersListFilterStore";
import { filterCountStore } from "@/hooks/filterCountStore";
import { ApiUsersPayloadType } from "@/types/usersTypes";
import { ProductsPayloadTypes } from "@/types/productsTypes";
import { BranchPayloadType } from "@/types/branchTypes";
import { PaymentModesPayloadType } from "@/types/paymentModesTypes";

interface OrdersListFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: () => void;
  apiUserList: ApiUsersPayloadType[];
  productList: ProductsPayloadTypes[];
  branchList: BranchPayloadType[];
  paymentModesList: PaymentModesPayloadType[];
}

const OrdersListFilters: React.FC<OrdersListFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  apiUserList,
  productList,
  branchList,
  paymentModesList,
}) => {
  // ======== CONSTANT AND HOOKS ========
  const { setFilterValue, resetFilterValue } = OrdersListFilterStore();
  const { setFilterCount, resetFilterCount } = filterCountStore();

  // ======== HOOK FORM ========
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(OrdersListFilterSchema),
    defaultValues: {
      month: null,
      order_status: null,
      api_user: null,
      branch: null,
      payment_mode: null,
      product: null,
    },
  });

  // ======== SELECT OPTIONS ========
  const monthOptions = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

  const orderStatusOptions = [
    { value: "accepted", label: "Accepted" },
    { value: "cancelled", label: "Cancelled" },
    { value: "pendingCOD", label: "PendingCOD" },
    { value: "rejected", label: "Rejected" },
    { value: "unverified", label: "Unverified" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
  ];

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
  const handleOnSubmit = (data: OrdersListFilterSchemaType) => {
    setFilterValue(data);

    const appliedFiltersCount = Object.values(data).filter(
      (value) => value
    ).length;

    setFilterCount(appliedFiltersCount);
    const hasAppliedFilters = appliedFiltersCount > 0;

    if (hasAppliedFilters) {
      setIsFilterOpen();
    }
  };

  const handleOnReset = () => {
    reset();
    resetFilterValue();
    resetFilterCount();
    setIsFilterOpen();
  };

  return (
    <>
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[620px] gap-6">
          <DialogHeader>
            <DialogTitle>Apply Filter</DialogTitle>
            <DialogDescription>
              Select a your desired filter from below.
            </DialogDescription>
          </DialogHeader>
          <form id="orders-filter" onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Month */}
              <div className="grid gap-2">
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
                          monthOptions.find(
                            (opt) => opt.value === field.value
                          ) ?? null
                        }
                        onChange={(opt) => field.onChange(opt?.value ?? null)}
                        styles={singleSelectStyle}
                        isClearable
                        placeholder="Select Month"
                        className="w-full"
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
              {/* Order Status */}
              <div className="grid gap-2">
                <Label htmlFor="order_status">Order Status</Label>
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="order_status"
                    render={({ field }) => (
                      <Select
                        key={`order_status-${field.value ?? "empty"}`}
                        id="order_status"
                        options={orderStatusOptions}
                        value={
                          orderStatusOptions.find(
                            (opt) => opt.value === field.value
                          ) ?? null
                        }
                        onChange={(opt) => field.onChange(opt?.value ?? null)}
                        styles={singleSelectStyle}
                        placeholder="Select Order Status"
                        isClearable
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
              {/* API User */}
              <div className="grid gap-2">
                <Label htmlFor="api_user">API User</Label>
                <Controller
                  name="api_user"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="api_user"
                      options={apiUsersOptions}
                      value={
                        apiUsersOptions.find(
                          (opt) => opt.value === Number(field.value)
                        ) || null
                      }
                      onChange={(opt) => field.onChange(opt?.value ?? null)}
                      isClearable
                      placeholder="Select API User"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.api_user && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.api_user.message}
                  </p>
                )}
              </div>
              {/* Product */}
              <div className="grid gap-2">
                <Label htmlFor="product">Product</Label>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="product"
                      options={productsOptions}
                      value={
                        productsOptions.find(
                          (opt) => opt.value === Number(field.value)
                        ) || null
                      }
                      onChange={(opt) => field.onChange(opt?.value ?? null)}
                      isClearable
                      placeholder="Select Product"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.product && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.product.message}
                  </p>
                )}
              </div>
              {/* Branch */}
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="branch"
                      options={branchOptions}
                      value={
                        branchOptions.find(
                          (opt) => opt.value === Number(field.value)
                        ) || null
                      }
                      onChange={(opt) => field.onChange(opt?.value ?? null)}
                      isClearable
                      placeholder="Select Branch"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.branch && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.branch.message}
                  </p>
                )}
              </div>
              {/* Payment Mode */}
              <div className="grid gap-2">
                <Label htmlFor="payment_mode">Payment Mode</Label>
                <Controller
                  name="payment_mode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="payment_mode"
                      options={paymentModesOptions}
                      value={
                        paymentModesOptions.find(
                          (opt) => opt.value === Number(field.value)
                        ) || null
                      }
                      onChange={(opt) => field.onChange(opt?.value ?? null)}
                      isClearable
                      placeholder="Select Payment Mode"
                      styles={singleSelectStyle}
                      className="w-full"
                    />
                  )}
                />
                {errors.payment_mode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.payment_mode.message}
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

export default OrdersListFilters;
