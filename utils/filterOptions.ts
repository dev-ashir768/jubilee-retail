export const createFilterOptions = (
  data: any[],
  key: string
) => {
  if (!data || data.length === 0) return [];

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const uniqueValues = Array.from(
    new Set(data.map((item) => getNestedValue(item, key)))
  );

  return uniqueValues
    .filter((value) => value != null)
    .map((value) => ({
      label: String(value),
      value: String(value),
    }));
};