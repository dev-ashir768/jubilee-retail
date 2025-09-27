export type WebAppMappersPayloadTypes = {
  id: number;
  parent_sku: string;
  child_sku: string;
  plan_id: number;
  product_id: number;
  option_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type WebAppMappersResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: WebAppMappersPayloadTypes[];
};
