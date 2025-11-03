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
import { clientFilterState } from "@/hooks/clientFilterState";
import {
  ClientFilterSchema,
  ClientFilterSchemaType,
} from "@/schemas/clientSchema";
import { BranchPayloadType } from "@/types/branchTypes";

interface ClientFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isFilterOpen: boolean) => void;
  branchList: BranchPayloadType[] | undefined;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  branchList,
}) => {
  // ======== CONSTANT AND HOOKS ========
  const { filterValue, setFilterValue, resetFilterValue } = clientFilterState();

  // ======== HOOK FORM ========
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(ClientFilterSchema),
    defaultValues: {
      branch: filterValue?.branch,
    },
  });

  useEffect(() => {
    if (isFilterOpen) {
      reset({
        branch: filterValue?.branch || null,
      });
    }
  }, [isFilterOpen, filterValue, reset]);

  // ======== SELECT OPTIONS ========
  const branchesOptions = branchList?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // ======== HANDLER ========
  const handleOnSubmit = (data: ClientFilterSchemaType) => {
    if (!data.branch) {
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
      branch: null,
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
          <form id="client-filter" onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="grid grid-cols-1 gap-6">
              {/* Branch Name */}
              <div className="space-y-2">
                <Label htmlFor="branch">Branch Name</Label>
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="branch"
                      options={branchesOptions}
                      value={branchesOptions?.filter(
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
                      placeholder="Select Branch Name"
                      styles={multiSelectStyle}
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
            </div>
          </form>
          <DialogFooter className="sm:justify-center gap-4">
            <Button
              size="lg"
              type="submit"
              className="min-w-[150px] cursor-pointer"
              form="client-filter"
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

export default ClientFilters;
