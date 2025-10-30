"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { useEffect, useState } from "react";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  align?: "end" | "center" | "start";
}

export function DatePicker({
  className,
  date,
  setDate,
  align = "end",
}: DatePickerProps) {
  // Local state to hold the date selection before applying
  const [localDate, setLocalDate] = useState<Date | undefined>(date);
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when the prop changes
  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  const handleApply = () => {
    setDate(localDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset local state to the parent's state
    setLocalDate(date);
    setIsOpen(false);
  };

  const handleReset = () => {
    const today = new Date();
    setDate(today);
    setIsOpen(false);
  };

  return (
    <div className={cn("", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="secondary"
            size="lg"
            className={cn(
              "w-full justify-center text-left font-normal cursor-pointer"
            )}
          >
            {date ? format(date, "LLL dd, yy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="single"
            defaultMonth={localDate || new Date()}
            selected={localDate}
            onSelect={setLocalDate}
            numberOfMonths={1}
            className="w-full"
          />
          <div className="flex justify-end gap-2 p-4 border-t">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="min-w-[79px] cursor-pointer"
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              className="min-w-[79px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="min-w-[79px] cursor-pointer"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
