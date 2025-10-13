export type CboPayloadType = {
  order_code: string;
  id: number;
  create_date: string;
  policy_number: string | null;
  issue_date: string;
  expiry_date: string;
  premium: string;
  customer_name: string;
  customer_contact: string;
  branch_name: string;
  product: string;
  no_of_persons_covered: string;
  cnno: string | null;
  payment_mode: string;
  api_user_name: string | null;
  policy_category: string;
  pec_coverage: string;
  renewal_coverage: string;
  order_status: string;
  policy_status: string;
};

export type CboResponseType = {
  status: 1 | 0;
  message: string;
  payload: CboPayloadType[];
};
