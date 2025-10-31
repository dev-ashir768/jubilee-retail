import { DateRange } from "react-day-picker";

export type subNavTypes = {
  title: string;
  addBtnTitle?: string;
  datePicker?: boolean;
  urlPath?: string;
  filter?: boolean;
  exportZip?: boolean;
  dateRange?: DateRange;
  isFilterOpen?: boolean;
  setIsFilterOpen?: (isFilterOpen: boolean) => void;
  setDateRange?: (date: DateRange | undefined) => void;
  isExportZipOpen?: boolean;
  setIsExportZipOpen?: (isExportZipOpen: boolean) => void;
  defaultDaysBack?: number
};
