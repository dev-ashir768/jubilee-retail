"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { useEffect, useState } from "react";

interface DateRangePickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  date: DateRange | undefined;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangeCalendar({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  const [localDate, setLocalDate] = useState<DateRange | undefined>(date);

  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  const handleSelect = (newDate: DateRange | undefined) => {
    setLocalDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Calendar
        mode="range"
        defaultMonth={localDate?.from}
        selected={localDate}
        onSelect={handleSelect}
        numberOfMonths={2}
        className="p-0 w-full"
      />
    </div>
  );
}
