export type ProductCategoriesPayloadTypes = {
  id: number;
  name: string;
  igis_product_code: string;
  department_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type ProductCategoriesResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: ProductCategoriesPayloadTypes[];
};
