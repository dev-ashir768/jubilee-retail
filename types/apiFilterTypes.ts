import { orderStatusEnum } from "./../schemas/ordersListFilterSchema";

export type OrdersListFilterType = {
  month: string | null;
  // product_id: number;
  // api_user_id: number;
  order_status: (typeof orderStatusEnum)[keyof typeof orderStatusEnum] | null;
  // branch_id: number;
  // payment_mode_id: number;
};
