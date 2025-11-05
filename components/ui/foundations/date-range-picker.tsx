"use client";

import * as React from "react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { useEffect, useState } from "react";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  align?: "end" | "center" | "start";
  defaultDaysBack?: number;
}

export function DateRangePicker({
  className,
  date,
  setDate,
  defaultDaysBack = 30,
  align = "end",
}: DateRangePickerProps) {
  // Local state to hold the date selection before applying
  const [localDate, setLocalDate] = useState<DateRange | undefined>(date);
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when the prop changes
  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  const handleSelect = (range: DateRange | undefined, triggerDate?: Date) => {
    if (range && localDate?.from && localDate?.to && triggerDate) {
      setLocalDate({ from: triggerDate, to: undefined });
      return;
    }
    // Default behavior for other cases
    setLocalDate(range);
  };

  const handleApply = () => {
    setDate(localDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalDate(date);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultDateRange = {
      from: subDays(new Date(), defaultDaysBack!),
      to: new Date(),
    };
    setLocalDate(defaultDateRange);
    setDate(defaultDateRange);
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
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, yy")} -{" "}
                  {format(date.to, "LLL dd, yy")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="range"
            defaultMonth={localDate?.from}
            selected={localDate}
            onSelect={handleSelect}
            numberOfMonths={2}
            captionLayout="dropdown"
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
