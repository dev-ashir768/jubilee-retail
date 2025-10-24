export type BulkPolicyDetailType = {
  name: string;
  type: string;
  relation: string;
  cnic: string | null;
  cnic_issue_date: string | null;
  dob: string | null;
  gender: string | null;
};

export type RiderTypes = {
  name: string;
  sum_insured: string;
};

export type CreateBulkOrder = {
  api_user_name: string;
  payment_mode_code: string;
  child_sku: string;
  order_code: string;
  customer_name: string;
  customer_cnic: string;
  customer_dob: string;
  customer_email: string;
  cnic_issue_date: string;
  customer_contact: string;
  customer_address: string;
  customer_gender: string;
  customer_occupation: string;
  start_date: string;
  expiry_date: string;
  issue_date: string;
  received_premium: string;
  policy_detail: BulkPolicyDetailType[];
  rider: RiderTypes[];
};

export type BulkPolicyDetail = {
  name: string;
  type: string;
  relation: string;
  cnic: string | null;
  cnic_issue_date: string | null;
  dob: string | null;
  gender: string | null;
};

export type BulkOrderSuccessResult = {
  order_code: string;
  status: string;
  message: string;
  orderId: number;
  policyId: number;
};

export type BulkOrderFailedResult = {
  order_code: string;
  status: string;
  message: string;
};

export type BulkOrderPayloadType = {
  total: number;
  success: number;
  failed: number;
  successResults: BulkOrderSuccessResult[];
  failedResults: BulkOrderFailedResult[];
};
export type BulkOrderResponseType = {
  status: 1 | 0;
  message: string;
  payload: BulkOrderPayloadType[];
};
