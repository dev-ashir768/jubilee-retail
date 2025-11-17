// "use client";

// import * as React from "react";
// import { format, subDays } from "date-fns";
// import { DateRange } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/shadcn/button";
// import { Calendar } from "@/components/ui/shadcn/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/shadcn/popover";
// import { useEffect, useState } from "react";

// interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
//   date: DateRange | undefined;
//   setDate: (date: DateRange | undefined) => void;
//   align?: "end" | "center" | "start";
//   defaultDaysBack?: number;
// }

// export function DateRangePicker({
//   className,
//   date,
//   setDate,
//   defaultDaysBack = 30,
//   align = "end",
// }: DateRangePickerProps) {
//   // Local state to hold the date selection before applying
//   const [localDate, setLocalDate] = useState<DateRange | undefined>(date);
//   const [isOpen, setIsOpen] = useState(false);

//   // Update local state when the prop changes
//   useEffect(() => {
//     setLocalDate(date);
//   }, [date]);

//   const handleSelect = (range: DateRange | undefined, triggerDate?: Date) => {
//     // Restart selection only if clicking on the existing 'from' date when a range (or single day) is selected
//     if (
//       range &&
//       localDate?.from &&
//       localDate?.to &&
//       triggerDate &&
//       triggerDate.getTime() === localDate.from.getTime()
//     ) {
//       setLocalDate({ from: triggerDate, to: undefined });
//       return;
//     }

//     // If only 'from' is selected (first click), set both 'from' and 'to' to that date for single-day selection
//     if (range?.from && !range?.to) {
//       setLocalDate({ from: range.from, to: range.from });
//       return;
//     }

//     // Default behavior: complete the range or handle other cases
//     setLocalDate(range);
//   };

//   const handleApply = () => {
//     setDate(localDate);
//     setIsOpen(false);
//   };

//   const handleCancel = () => {
//     setLocalDate(date);
//     setIsOpen(false);
//   };

//   const handleReset = () => {
//     const defaultDateRange = {
//       from: subDays(new Date(), defaultDaysBack!),
//       to: new Date(),
//     };
//     setLocalDate(defaultDateRange);
//     setDate(defaultDateRange);
//     setIsOpen(false);
//   };

//   return (
//     <div className={cn("", className)}>
//       <Popover open={isOpen} onOpenChange={setIsOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant="secondary"
//             size="lg"
//             className={cn(
//               "w-full justify-center text-left font-normal cursor-pointer"
//             )}
//           >
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "LLL dd, yy")} -{" "}
//                   {format(date.to, "LLL dd, yy")}
//                 </>
//               ) : (
//                 format(date.from, "LLL dd, y")
//               )
//             ) : (
//               <span>Pick a date range</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align={align}>
//           <Calendar
//             mode="range"
//             defaultMonth={localDate?.from}
//             selected={localDate}
//             onSelect={handleSelect}
//             numberOfMonths={2}
//             captionLayout="dropdown"
//           />
//           <div className="flex justify-end gap-2 p-4 border-t">
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={handleReset}
//               className="min-w-[79px] cursor-pointer"
//             >
//               Reset
//             </Button>
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={handleCancel}
//               className="min-w-[79px] cursor-pointer"
//             >
//               Cancel
//             </Button>
//             <Button
//               size="sm"
//               onClick={handleApply}
//               className="min-w-[79px] cursor-pointer"
//             >
//               Apply
//             </Button>
//           </div>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, isSameDay, isSameMonth } from "date-fns";
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
}

export function DateRangePicker({
  className,
  date,
  setDate,
  align = "end",
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
  const prevMonthFrom = startOfMonth(subMonths(now, 1));
  const prevMonthTo = endOfMonth(subMonths(now, 1));
  const prevYearFrom = startOfYear(subYears(now, 1));
  const prevYearTo = endOfYear(subYears(now, 1));

  // Helper to check if localDate matches a preset – Now uses isSameDay/isSameMonth for time-insensitive comparison
  const isPresetActive = (presetFrom: Date, presetTo: Date): boolean => {
    if (!localDate?.from || !localDate?.to) {
      return false;
    }
    // For exact from/to match, ignoring time differences
    return (
      isSameMonth(localDate.from, presetFrom) &&
      isSameDay(localDate.from, presetFrom) &&
      isSameDay(localDate.to, presetTo)
    );
  };

  // Preset handlers – All 'to' ends on today where applicable; 'from' starts properly
  const handleCurrentMonth = () => {
    const currentMonthRange = {
      from: currentMonthFrom,
      to: currentMonthTo, // Up to today
    };
    setLocalDate(currentMonthRange);
  };

  const handlePreviousMonth = () => {
    const prevMonthRange = {
      from: prevMonthFrom,
      to: prevMonthTo, // Full previous month (ends on last day of prev month)
    };
    setLocalDate(prevMonthRange);
  };

  const handlePreviousYear = () => {
    const prevYearRange = {
      from: prevYearFrom,
      to: prevYearTo, // Full previous year
    };
    setLocalDate(prevYearRange);
  };

  const handleSelect = (range: DateRange | undefined, triggerDate?: Date) => {
    // Restart selection only if clicking on the existing 'from' date when a range (or single day) is selected
    if (
      range &&
      localDate?.from &&
      localDate?.to &&
      triggerDate &&
      triggerDate.getTime() === localDate.from.getTime()
    ) {
      setLocalDate({ from: triggerDate, to: undefined });
      return;
    }

    // If only 'from' is selected (first click), set both 'from' and 'to' to that date for single-day selection
    if (range?.from && !range?.to) {
      setLocalDate({ from: range.from, to: range.from });
      return;
    }

    // Default behavior: complete the range or handle other cases
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
    // Reset to current month range (start of month to today)
    const resetDateRange = {
      from: currentMonthFrom,
      to: currentMonthTo,
    };
    setLocalDate(resetDateRange);
    setDate(resetDateRange);
    setIsOpen(false);
  };

  // Format selected range for display
  const selectedRangeText = localDate?.from && localDate?.to
    ? `${format(localDate.from, "MMM dd, yyyy")} - ${format(localDate.to, "MMM dd, yyyy")}`
    : localDate?.from
    ? format(localDate.from, "MMM dd, yyyy")
    : "No date selected";

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
          <div className="p-3 border-b flex justify-center gap-2 bg-muted/50">
            <Button
              variant={isPresetActive(currentMonthFrom, currentMonthTo) ? "default" : "ghost"}
              size="sm"
              onClick={handleCurrentMonth}
              className="h-8 px-3"
            >
              Current Month
            </Button>
            <Button
              variant={isPresetActive(prevMonthFrom, prevMonthTo) ? "default" : "ghost"}
              size="sm"
              onClick={handlePreviousMonth}
              className="h-8 px-3"
            >
              Previous Month
            </Button>
            <Button
              variant={isPresetActive(prevYearFrom, prevYearTo) ? "default" : "ghost"}
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
          </div>

          {/* Calendar */}
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