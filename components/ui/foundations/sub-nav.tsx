"use client";

import { subNavTypes } from "@/types/subNavTypes";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { getRights } from "@/utils/getRights";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DateRangePicker } from "./date-range-picker";
import { FunnelIcon } from "lucide-react";
import { filterCountStore } from "@/hooks/filterCountStore";

const SubNav: React.FC<subNavTypes> = ({
  title,
  addBtnTitle,
  urlPath,
  dateRange,
  datePicker = false,
  isFilterOpen,
  setIsFilterOpen,
  setDateRange,
  filter = false,
}) => {
  // HOOKS AND CONSTANTS
  const pathname = usePathname();
  const { filterCount } = filterCountStore();

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div className="flex flex-wrap gap-3">
        {filter && (
          <Button
            onClick={() => setIsFilterOpen!(!isFilterOpen)}
            variant="secondary"
            size="icon"
            className="relative"
            aria-label="Multi Filters"
          >
            <FunnelIcon />
            <span className="bg-primary rounded-full size-4 text-white text-xs absolute top-[-2px] left-[-6px] flex justify-center items-center">
              {filterCount}
            </span>
          </Button>
        )}

        {addBtnTitle && rights?.can_create === "1" ? (
          <Button size="lg" className="min-w-[150px]" asChild>
            {urlPath && <Link href={urlPath}>{addBtnTitle}</Link>}
          </Button>
        ) : null}

        {datePicker && setDateRange && (
          <DateRangePicker date={dateRange} setDate={setDateRange} />
        )}
      </div>
    </div>
  );
};

export default SubNav;
