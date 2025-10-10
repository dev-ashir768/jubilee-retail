export type CouponsPayloadType = {
  id: number;
  code: string;
  campaign_name: string;
  expiry_date: string;
  application_date: string;
  quantity: number;
  coupon_type: string;
  discount_value: string;
  use_per_customer: number;
  remaining: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CouponsResponseType = {
  status: 1 | 0;
  message: string;
  payload: CouponsPayloadType[];
};
