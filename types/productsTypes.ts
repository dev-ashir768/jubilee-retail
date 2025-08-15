export type ProductsPayloadTypes = {
  id: number;
  product_name: string;
  product_type: string;
  product_category_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type ProductsResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: ProductsPayloadTypes[];
};
