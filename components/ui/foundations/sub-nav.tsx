"use client";

import { subNavTypes } from "@/types/subNavTypes";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { getRights } from "@/utils/getRights";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DateRangePicker } from "./date-range-picker";

const SubNav: React.FC<subNavTypes> = ({
  title,
  addBtnTitle,
  urlPath,
  dateRange,
  datePicker = false,
  setDateRange,
}) => {
  const pathname = usePathname();
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {addBtnTitle && rights?.can_create === "1" ? (
        <div>
          <Button size="lg" className="min-w-[150px]" asChild>
            {urlPath && <Link href={urlPath}>{addBtnTitle}</Link>}
          </Button>
        </div>
      ) : null}

      {datePicker && setDateRange && (
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      )}
    </div>
  );
};

export default SubNav;
