export type OrdersListFilterType = {
  month: string | null;
  // order_status: (typeof orderStatusEnum)[keyof typeof orderStatusEnum] | null;
  order_status:
    | "accepted"
    | "cancelled"
    | "pendingCOD"
    | "rejected"
    | "unverified"
    | "verified"
    | "pending"
    | null;
  branch_id: number | null;
  payment_mode_id: number | null;
  product_id: number | null;
  api_user_id: number | null;
  cnic: string | null;
  contact: string | null;
};
