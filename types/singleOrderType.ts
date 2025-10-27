export interface PaymentMethodType {
  id: number;
  name: string;
  payment_code: string;
  created_by: number;
  deleted_by: number | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PolicyTravelType {
  id: number;
  policy_id: number;
  sponsor: string;
  sponsor_address: string;
  sponsor_contact: string;
  institute: string;
  travel_from: string;
  travelling_dates: string | null;
  program: string;
  offer_letter_ref_no: string;
  no_of_days: string;
  travel_purpose: string;
  destination: string;
  tution_fee: boolean;
  type: string;
  travel_end_date: string;
  travel_start_date: string;
  program_duration: string;
  travel_type: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PolicyDetailType {
  id: number;
  policy_id: number;
  name: string;
  dob: string | null;
  cnic: string;
  occupation: string | null;
  address: string | null;
  contact_number: string;
  email: string;
  city: number | null;
  gender: string | null;
  age: number | null;
  type: string;
  relation: string;
  passport_no: string;
  poc: string | null;
  nicop: string | null;
  cnic_issue_date: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductOptionType {
  id: number;
  product_id: number;
  option_name: string;
  price: string;
  duration_type: string;
  duration: number;
  start_limit: number;
  end_limit: number;
  stamp_duty: number;
  sales_tax: number;
  federal_insurance_fee: number;
  gross_premium: number;
  subtotal: number;
  administrative_subcharges: number;
  start_limit_mother: number;
  end_limit_mother: number;
  plan_code: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductType {
  id: number;
  product_name: string;
  product_type: string;
  product_category_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  productCategory: ProductCategoryType;
}

export interface ProductCategoryType {
  id: number;
  name: string;
  igis_product_code: string;
  department_id: number;
  product_code: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PlanType {
  id: number;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PolicyType {
  id: number;
  policy_code: string;
  igis_policy_code: string;
  pmdc_no: string | null;
  order_id: number;
  parent_id: number | null;
  plan_id: number;
  product_id: number;
  product_option_id: number;
  extended_warranty_id: number | null;
  api_user_id: number | null;
  issue_date: string;
  start_date: string;
  expiry_date: string;
  item_price: string;
  received_premium: string;
  discount_amount: string;
  sum_insured: string;
  filer_tax_per_item: string;
  filer_tax_total: string;
  filer_tax_status: boolean;
  status: string;
  type: string;
  product_type: string | null;
  takaful_policy: boolean;
  is_renewed: boolean;
  refunded: boolean;
  quantity: number;
  qr_doc_url: string;
  schengen: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  plan: PlanType;
  product: ProductType;
  productOption: ProductOptionType;
  policyDetails: PolicyDetailType[];
  PolicyTravel: PolicyTravelType[];
  PolicyHomecare: any[];
  PolicyPurchaseProtection: any[];
}

export type SingleOrderPayloadTypes = {
  id: number;
  order_code: string;
  create_date: string;
  parent_id: number;
  customer_name: string;
  customer_cnic: string;
  customer_dob: string;
  customer_email: string;
  customer_contact: string;
  customer_address: string;
  customer_city: string;
  customer_occupation: string | null;
  status: string;
  payment_method_id: number;
  payment: string;
  coupon_id: number | null;
  discount_amount: string;
  received_premium: string;
  branch_id: number | null;
  branch_name: string;
  agent_id: number | null;
  agent_name: string;
  client_id: number | null;
  development_office_id: number | null;
  shipping_method: string;
  shipping_charges: string;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_email: string | null;
  shipping_phone: string | null;
  tracking_number: string | null;
  courier_status: string | null;
  delivery_date: string | null;
  refunded: boolean;
  staff_comments: string;
  cc_transaction_id: string | null;
  cc_approval_code: string | null;
  jazzcash_date_time: string | null;
  channel: string | null;
  idev: string;
  referred_by: string;
  kiosk_pin: string | null;
  kiosk_last_digit: string | null;
  test_book: boolean;
  api_user_id: number | null;
  renewal_number: string | null;
  pec_coverage: string | null;
  created_by: number;
  deleted_by: number | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  payemntMethod: PaymentMethodType;
  coupon: any | null;
  branch: any | null;
  agent: any | null;
  client: any | null;
  developmentOfficer: any | null;
  apiUser: any | null;
  Policy: PolicyType[];
};

export type SingleOrderResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: SingleOrderPayloadTypes[];
};
