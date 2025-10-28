"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { useEffect, useState } from "react";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
}

export function DateRangeCalendar({
  className,
  date,
}: DateRangePickerProps) {
  const [localDate, setLocalDate] = useState<DateRange | undefined>(date);

  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Calendar
        mode="range"
        defaultMonth={localDate?.from}
        selected={localDate}
        onSelect={setLocalDate}
        numberOfMonths={2}
        className="p-0 w-full"
      />
    </div>
  );
}