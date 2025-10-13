export type OrdersListPayloadType = {
  id: number;
  order_code: string;
  create_date: string;
  premium: "string";
  customer_name: string;
  customer_contact: string;
  branch_name: string;
  cnno: string | null;
  payment_mode: string;
  api_user_name: string | null;
  order_status: string;
};

export type OrdersListResponseType = {
  status: 1 | 0;
  message: string;
  payload: OrdersListPayloadType[];
};
