"use client";

import { subNavTypes } from "@/types/subNavTypes";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { getRights } from "@/utils/getRights";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DateRangePicker } from "./date-range-picker";
import { FunnelIcon } from "lucide-react";

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
  const pathname = usePathname();

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
          <Button onClick={()=> setIsFilterOpen!(!isFilterOpen)} variant="secondary" size="icon" aria-label="Multi Filters">
            <FunnelIcon />
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
