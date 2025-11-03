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
import { motorQuotesFilterState } from "@/hooks/motorQuotesFilterState";
import {
  MotorQuoteFilterSchema,
  MotorQuoteFilterSchemaType,
} from "@/schemas/motorQuoteSchema";
import { toast } from "sonner";

interface MotorQuotesFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isFilterOpen: boolean) => void;
}

type statusListType = {
  value: "pending" | "cancelled" | "approved";
  label: string;
};

const statusList: statusListType[] = [
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "approved", label: "Approved" },
];

const MotorQuotesFilters: React.FC<MotorQuotesFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
}) => {
  // ======== CONSTANT AND HOOKS ========
  const { filterValue, resetFilterValue, setFilterValue } =
    motorQuotesFilterState();

  // ======== HOOK FORM ========
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(MotorQuoteFilterSchema),
    defaultValues: {
      status: filterValue,
    },
  });

  useEffect(() => {
    if (isFilterOpen) {
      reset({
        status: filterValue,
      });
    }
  }, [isFilterOpen, filterValue, reset]);

  // ======== SELECT OPTIONS ========
  const statusOptions: statusListType[] = statusList.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  // ======== HANDLER ========
  const handleOnSubmit = (data: MotorQuoteFilterSchemaType) => {
    if (!data.status) {
      toast.error("Select atleast one status option");
      return;
    }

    setFilterValue(data.status!);

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
      status: null,
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
          <form
            id="api-user-products-filter"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className="grid grid-cols-1 gap-6">
              {/* API User */}
              <div className="space-y-2">
                <Label htmlFor="status">API User</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="status"
                      options={statusOptions}
                      value={statusOptions.filter(
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
              form="api-user-products-filter"
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

export default MotorQuotesFilters;
