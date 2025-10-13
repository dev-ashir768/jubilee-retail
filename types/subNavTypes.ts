import { DateRange } from "react-day-picker";

export type subNavTypes = {
  title: string;
  addBtnTitle?: string;
  datePicker?: boolean
  urlPath?: string;
  dateRange?: DateRange;
  setDateRange?: (date: DateRange | undefined) => void;
};
