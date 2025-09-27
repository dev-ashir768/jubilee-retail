export type PaymentModesPayloadType = {
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
};
export type PaymentModesResponseType = {
  status: 1 | 0;
  message: string;
  payload: PaymentModesPayloadType[];
};
