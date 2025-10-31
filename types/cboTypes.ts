export type CboPayloadType = {
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
  customer_cnic: string;
  product_id: number;
  no_of_persons_covered: string;
  policy_category: string | null;
  pec_coverage: string | null;
  renewal_number: string | null;
  payment_code: string;
  is_takaful: number;
  policy_id: number;
};

export type CboResponseType = {
  status: 1 | 0;
  message: string;
  payload: CboPayloadType[];
};
