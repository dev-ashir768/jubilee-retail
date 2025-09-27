export type ApiUserProductsPayloadType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  product_name: string;
  product_type: string;
  product_category_id: number;
  product_id: number;
  api_user_id: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type ApiUserProductsResponseType = {
  status: 1 | 0;
  message: string;
  payload: ApiUserProductsPayloadType[];
};
