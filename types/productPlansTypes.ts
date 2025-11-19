export type ProductsTypes = {
  product_id: number;
  product_name: string;
  product_type: string;
  product_category_id: number;
  parent_sku: string;
  child_sku: string;
};

export type ProductPlansPayloadTypes = {
  id: number;
  name: string;
  email: string;
  phone: string;
  api_user_id: number;
  products: ProductsTypes[];
  is_active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ProductPlansResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: ProductPlansPayloadTypes[];
};
