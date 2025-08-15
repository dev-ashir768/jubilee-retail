export type DurationTypeEnum = "day" | "month" | "year";

export type ProductOptionsPayloadTypes = {
  id: number;
  product_id: number;
  option_name: string;
  price: number;
  duration_type: DurationTypeEnum;
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
  plan_code: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type ProductOptionsResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: ProductOptionsPayloadTypes[];
};
