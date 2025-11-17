export const NumberFormaterFunction = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

export const formatNumberCell = (value: any): string => {
  if (value === null || value === undefined || value === "N/A") return "N/A";
  const numValue =
    typeof value === "string" ? parseFloat(value) : Number(value);
  if (isNaN(numValue)) return "N/A";
  return NumberFormaterFunction(numValue);
};
