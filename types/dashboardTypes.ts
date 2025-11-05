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

// product-share-of-policy-amount-by-amount

export type ProductShareOfPolicyAmountByAmountPayloadType = {
  product_name: string;
  policy_amount: string;
};

export type ProductShareOfPolicyAmountByAmountResponse = {
  status: 1 | 0;
  message: string;
  payload: ProductShareOfPolicyAmountByAmountPayloadType[];
};

// top-5-agents

export type Top5AgentsPayloadType = {
  agent_name: string;
  policy_amount: string;
};

export type Top5AgentsResponse = {
  status: 1 | 0;
  message: string;
  payload: Top5AgentsPayloadType[];
};

// recent-orders

export type RecentOrdersPayloadType = {
  order_code: string;
  customer_name: string;
  customer_contact: string;
  product_name: string;
  received_premium: string;
  status: string;
  created_at: string;
};

export type RecentOrdersResponse = {
  status: 1 | 0;
  message: string;
  payload: RecentOrdersPayloadType[];
};

// payment-mode

export type PaymentModePayloadType = {
  payment_mode: string;
  payment_code: string;
  total_orders: number;
  total_received_amount: string;
  valid_policies_count: number;
  total_discount_given: string;
};

export type PaymentModeResponse = {
  status: 1 | 0;
  message: string;
  payload: PaymentModePayloadType[];
};

// top-5-branches

export type Top5BranchesPayloadType = {
  branch_name: string;
  policy_amount: string;
};

export type Top5BranchesResponse = {
  status: 1 | 0;
  message: string;
  payload: Top5BranchesPayloadType[];
};
