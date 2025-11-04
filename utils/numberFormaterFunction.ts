export const NumberFormaterFunction = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};
