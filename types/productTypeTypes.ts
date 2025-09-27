export type ProductTypePayloadTypes = {
  id: number;
  name: string,
  days: number,
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type ProductTypeResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: ProductTypePayloadTypes[];
};
