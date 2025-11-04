export type PolicyStatsPayloadType = {
  total_orders: number;
  total_valid_policies: number;
  order_received_premium: number;
  policy_received_premium: number;
};

export type PolicyStatsResponse = {
  status: 1 | 0;
  message: string;
  payload: PolicyStatsPayloadType[];
};

export type MonthlyPolicyNOrdersPayloadType = {
  sale_date: number;
  daily_orders: number;
  daily_policies: number;
};

export type MonthlyPolicyNOrdersResponse = {
  status: 1 | 0;
  message: string;
  payload: MonthlyPolicyNOrdersPayloadType[];
};

export type ProductsDetailWisePayloadType = {
  product_name: string | null;
  total_orders: number;
  total_valid_policies: number;
  order_amount: number;
  policy_amount: number;
};

export type ProductsDetailWiseResponse = {
  status: 1 | 0;
  message: string;
  payload: ProductsDetailWisePayloadType[];
};

export type ProductsByProductAmountPayloadType = {
  product_name: string | null;
  total_orders: number;
  total_valid_policies: number;
  order_amount: number;
  policy_amount: number;
};

export type ProductsByProductAmountResponse = {
  status: 1 | 0;
  message: string;
  payload: ProductsByProductAmountPayloadType[];
};

export type ApiUsersByPolicyAmountPayloadType = {
  api_user_name: string | null;
  api_user_email: string | null;
  total_orders: number;
  total_valid_policies: number;
  order_amount: number;
  policy_amount: number;
};

export type ApiUsersByPolicyAmountResponse = {
  status: 1 | 0;
  message: string;
  payload: ApiUsersByPolicyAmountPayloadType[];
};

export type PolicyStatusBreakdownPayloadType = {
  status_group: string;
  count: number;
};

export type PolicyStatusBreakdownResponse = {
  status: 1 | 0;
  message: string;
  payload: PolicyStatusBreakdownPayloadType[];
};