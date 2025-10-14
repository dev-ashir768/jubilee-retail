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

interface OrdersListFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: () => void;
}

const OrdersListFilters: React.FC<OrdersListFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
}) => {
  // HOOK FORM
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
    },
  });

  // SELECT OPTIONS
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

  // FORM HANDLER
  const handleOnSubmit = (data: OrdersListFilterSchemaType) => {
    console.log(data);
  };

  const handleOnReset = () => {
    reset({ month: null, order_status: null });
    console.log("hel");
  };

  return (
    <>
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[440px] gap-6">
          <DialogHeader>
            <DialogTitle>Apply Filter</DialogTitle>
            <DialogDescription>
              Select a your desired filter from below.
            </DialogDescription>
          </DialogHeader>
          <form id="orders-filter" onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="grid gap-6">
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
            </div>
          </form>
          <DialogFooter>
            <Button size="lg" variant="secondary" onClick={handleOnReset}>
              Reset
            </Button>
            <Button size="lg" type="submit" form="orders-filter">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersListFilters;
