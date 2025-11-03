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
