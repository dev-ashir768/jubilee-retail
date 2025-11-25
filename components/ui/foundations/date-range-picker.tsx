"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  isSameDay,
  isSameMonth,
  eachDayOfInterval, // Used for range validation
} from "date-fns";
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

export type CalendarProps = React.ComponentProps<typeof Calendar>;

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  align?: "end" | "center" | "start";
  disabledDates?: CalendarProps["disabled"];
  defaultDate?: DateRange;
}

export function DateRangePicker({
  className,
  date,
  setDate,
  align = "end",
  disabledDates,
  defaultDate,
}: DateRangePickerProps) {
  // Local state to hold the date selection before applying
  const [localDate, setLocalDate] = useState<DateRange | undefined>(date);
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when the prop changes
  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  // Compute presets once for consistency
  const now = new Date();
  const currentMonthFrom = startOfMonth(now);
  const currentMonthTo = now;
  const currentYearFrom = startOfYear(now);
  const currentYearTo = now;
  const prevMonthFrom = startOfMonth(subMonths(now, 1));
  const prevMonthTo = endOfMonth(subMonths(now, 1));
  const prevYearFrom = startOfYear(subYears(now, 1));
  const prevYearTo = endOfYear(subYears(now, 1));

  // Helper to check if localDate matches a preset
  const isPresetActive = (presetFrom: Date, presetTo: Date): boolean => {
    if (!localDate?.from || !localDate?.to) {
      return false;
    }
    return (
      isSameMonth(localDate.from, presetFrom) &&
      isSameDay(localDate.from, presetFrom) &&
      isSameDay(localDate.to, presetTo)
    );
  };

  // Preset handlers
  const handleCurrentMonth = () => {
    const currentMonthRange = { from: currentMonthFrom, to: currentMonthTo };
    setLocalDate(currentMonthRange);
  };

  const handleCurrentYear = () => {
    const currentYearRange = { from: currentYearFrom, to: currentYearTo };
    setLocalDate(currentYearRange);
  };

  const handlePreviousMonth = () => {
    const prevMonthRange = { from: prevMonthFrom, to: prevMonthTo };
    setLocalDate(prevMonthRange);
  };

  const handlePreviousYear = () => {
    const prevYearRange = { from: prevYearFrom, to: prevYearTo };
    setLocalDate(prevYearRange);
  };

  const handleSelect = (range: DateRange | undefined, triggerDate?: Date) => {
    // Logic for restarting selection or handling single day selection
    if (
      range &&
      localDate?.from &&
      localDate?.to &&
      triggerDate &&
      isSameDay(triggerDate, localDate.from)
    ) {
      setLocalDate({ from: triggerDate, to: undefined });
      return;
    }

    if (range?.from && !range?.to) {
      setLocalDate({ from: range.from, to: range.from });
      return;
    }

    setLocalDate(range);
  };

  const handleApply = () => {
    // Prevent applying if disabled
    if (isApplyDisabled) return;

    setDate(localDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalDate(date);
    setIsOpen(false);
  };

  const handleReset = () => {
    if (defaultDate) {
      setLocalDate(defaultDate);
      setDate(defaultDate);
    } else {
      setLocalDate(date);
      setDate(date);
    }
    setIsOpen(false);
  };

  const selectedRangeText =
    localDate?.from && localDate?.to
      ? `${format(localDate.from, "MMM dd, yyyy")} - ${format(
          localDate.to,
          "MMM dd, yyyy"
        )}`
      : localDate?.from
      ? format(localDate.from, "MMM dd, yyyy")
      : "No date selected";

  const isRangeInvalid = (
    range: DateRange | undefined,
    disabled: CalendarProps["disabled"]
  ): boolean => {
    if (!range?.from || !range?.to || !disabled) {
      return false;
    }

    // Case 1: Disabled prop is a function (e.g., disabling weekends)
    if (typeof disabled === "function") {
      try {
        const datesToCheck = eachDayOfInterval({
          start: range.from,
          end: range.to,
        });
        return datesToCheck.some(disabled);
      } catch (error: unknown) {
        console.log(error);
        return true; // Invalid interval
      }
    }

    // Case 2: Disabled prop is an object (e.g., { before: Date })
    if (typeof disabled === "object") {
      // Check for 'before' constraint (e.g., disabling past dates)
      if ("before" in disabled && disabled.before instanceof Date) {
        const beforeDate = disabled.before;
        // If the range starts BEFORE the disabled date, it's invalid.
        // We check the 'from' date of the range.
        if (range.from < beforeDate && !isSameDay(range.from, beforeDate)) {
          return true;
        }
      }

      // Check for 'after' constraint (e.g., disabling future dates)
      if ("after" in disabled && disabled.after instanceof Date) {
        const afterDate = disabled.after;
        // If the range ends AFTER the disabled date, it's invalid.
        // We check the 'to' date of the range.
        if (range.to > afterDate && !isSameDay(range.to, afterDate)) {
          return true;
        }
      }
    }

    // For other types (like simple Date arrays or other complex formats), we rely on the Calendar's internal UI validation.
    return false;
  };

  const isRangeContainsDisabledDate = isRangeInvalid(localDate, disabledDates);

  const isApplyDisabled =
    isRangeContainsDisabledDate || !localDate?.from || !localDate?.to;

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
          {/* Preset Buttons Row */}
          <div className="grid grid-cols-4 p-3 border-b bg-muted/50">
            <Button
              variant={
                isPresetActive(currentMonthFrom, currentMonthTo)
                  ? "default"
                  : "ghost"
              }
              size="sm"
              onClick={handleCurrentMonth}
              className="h-8 px-3"
            >
              Current Month
            </Button>
            <Button
              variant={
                isPresetActive(currentYearFrom, currentYearTo)
                  ? "default"
                  : "ghost"
              }
              size="sm"
              onClick={handleCurrentYear}
              className="h-8 px-3"
            >
              Current Year
            </Button>
            <Button
              variant={
                isPresetActive(prevMonthFrom, prevMonthTo) ? "default" : "ghost"
              }
              size="sm"
              onClick={handlePreviousMonth}
              className="h-8 px-3"
            >
              Previous Month
            </Button>
            <Button
              variant={
                isPresetActive(prevYearFrom, prevYearTo) ? "default" : "ghost"
              }
              size="sm"
              onClick={handlePreviousYear}
              className="h-8 px-3"
            >
              Previous Year
            </Button>
          </div>

          {/* Selected Range Display */}
          <div className="p-2 text-sm text-muted-foreground text-center border-b">
            Selected: {selectedRangeText}
            {isRangeContainsDisabledDate && (
              <p className="text-red-500 text-xs mt-1">
                Selected range includes disabled dates. Adjust range to apply.
              </p>
            )}
          </div>

          {/* Calendar */}
          <Calendar
            mode="range"
            defaultMonth={localDate?.from}
            selected={localDate}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={disabledDates} // ✅ Correct: This is for visual date disabling on the grid
            captionLayout="dropdown"
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
              disabled={isApplyDisabled}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
