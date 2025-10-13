export type PoliciesPayloadType = {
  id: number;
  order_code: string;
  policy_number: string;
  create_date: string;
  issue_date: string;
  expiry_date: string;
  premium: string;
  customer_name: string;
  customer_contact: string;
  branch_name: string;
  product: string;
  cnno: string | null;
  payment_mode: string;
  api_user_name: string | null;
  order_status: string;
  policy_status: string;
};

export type PoliciesResponseType = {
  status: 1 | 0;
  message: string;
  payload: PoliciesPayloadType[];
};
