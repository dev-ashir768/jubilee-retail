"use client";

import { subNavTypes } from "@/types/subNavTypes";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { getRights } from "@/utils/getRights";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DateRangePicker } from "./date-range-picker";
import { Download, FunnelIcon } from "lucide-react";
import { ordersListFilterState } from "@/hooks/ordersListFilterState";
import { renewalPolicyFilterState } from "@/hooks/renewalPolicyFilterState";
import { cboListFilterState } from "@/hooks/cboListFilterState";
import { policyListFilterState } from "@/hooks/policyListFilterState";
import { apiUserProductsFilterState } from "@/hooks/apiUserProductsFilterState";
import { motorQuotesFilterState } from "@/hooks/motorQuotesFilterState";
import { clientFilterState } from "@/hooks/clientFilterState";
import { couponFilterState } from "@/hooks/couponFilterState";

const SubNav: React.FC<subNavTypes> = ({
  title,
  addBtnTitle,
  urlPath,
  dateRange,
  datePicker = false,
  isFilterOpen,
  setIsFilterOpen,
  setDateRange,
  isExportZipOpen,
  setIsExportZipOpen,
  filter = false,
  exportZip = false,
}) => {
  // HOOKS AND CONSTANTS
  const pathname = usePathname();
  let filterCount;

  switch (pathname) {
    case "/orders/list": {
      ({ filterCount } = ordersListFilterState());
      break;
    }

    case "/orders/policies": {
      ({ filterCount } = policyListFilterState());
      break;
    }

    case "/orders/renewals": {
      ({ filterCount } = renewalPolicyFilterState());
      break;
    }

    case "/orders/cbo": {
      ({ filterCount } = cboListFilterState());
      break;
    }

    case "/users/api-user-products": {
      ({ filterCount } = apiUserProductsFilterState());
      break;
    }

    case "/motor-quote/manage": {
      ({ filterCount } = motorQuotesFilterState());
      break;
    }

    case "/branches-clients/Clients-list": {
      ({ filterCount } = clientFilterState());
      break;
    }

    case "/coupons-management/coupons": {
      ({ filterCount } = couponFilterState());
      break;
    }

    default: {
      filterCount = 0;
      break;
    }
  }

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

        {exportZip && (
          <Button
            onClick={() => setIsExportZipOpen!(!isExportZipOpen)}
            variant="secondary"
            size="icon"
            aria-label="Export Zip"
          >
            <Download />
          </Button>
        )}

        {addBtnTitle && rights?.can_create === "1" ? (
          <Button size="lg" className="min-w-[150px]" asChild>
            {urlPath && <Link href={urlPath}>{addBtnTitle}</Link>}
          </Button>
        ) : null}

        {datePicker && setDateRange && (
          <DateRangePicker
            date={dateRange}
            setDate={setDateRange}
          />
        )}
      </div>
    </div>
  );
};

export default SubNav;
