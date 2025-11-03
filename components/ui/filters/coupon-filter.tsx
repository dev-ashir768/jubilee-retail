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
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { multiSelectStyle } from "@/utils/selectStyles";
import { toast } from "sonner";
import { ProductsPayloadTypes } from "@/types/productsTypes";
import { couponFilterState } from "@/hooks/couponFilterState";
import {
  CouponFilterSchema,
  CouponFilterSchemaType,
} from "@/schemas/couponsSchema";

interface CouponFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isFilterOpen: boolean) => void;
  productList: ProductsPayloadTypes[];
}

const CouponFilters: React.FC<CouponFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  productList,
}) => {
  // ======== CONSTANT AND HOOKS ========
  const { filterValue, setFilterValue, resetFilterValue } = couponFilterState();

  // ======== HOOK FORM ========
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(CouponFilterSchema),
    defaultValues: {
      product_id: filterValue?.product_id || null,
    },
  });

  useEffect(() => {
    if (isFilterOpen) {
      reset({
        product_id: filterValue?.product_id || null,
      });
    }
  }, [isFilterOpen, filterValue, reset]);

  // ======== SELECT OPTIONS ========
  const productOptions = productList?.map((item) => ({
    value: item.id,
    label: item.product_name,
  }));

  // ======== HANDLER ========
  const handleOnSubmit = (data: CouponFilterSchemaType) => {
    if (!data.product_id) {
      toast.error("Select atleast one option");
      return;
    }

    setFilterValue(data);

    const appliedFiltersCount = Object.values(data).filter(
      (value) => value
    ).length;

    const hasAppliedFilters = appliedFiltersCount > 0;

    if (hasAppliedFilters) {
      setIsFilterOpen(!isFilterOpen);
    }
  };

  const handleOnReset = () => {
    reset({
      product_id: null,
    });
    resetFilterValue();
    setIsFilterOpen(!isFilterOpen);
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
          <form id="coupon-filter" onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="grid grid-cols-1 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="product_id">Product Name</Label>
                <Controller
                  name="product_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="branch"
                      options={productOptions}
                      value={productOptions?.filter(
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
                      placeholder="Select Product Name"
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
            </div>
          </form>
          <DialogFooter className="sm:justify-center gap-4">
            <Button
              size="lg"
              type="submit"
              className="min-w-[150px] cursor-pointer"
              form="coupon-filter"
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

export default CouponFilters;
