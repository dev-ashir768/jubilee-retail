import { axiosFunction } from "@/utils/axiosFunction";

interface fetchOrdersListingProps {
  mode: string;
  startDate?: string;
  endDate?: string;
  month?: string | null;
  order_status?: string | null;
  policy_status?: string | null;
  cnic?: string | null;
  contact?: string | null;
  payment_mode_id?: number | null;
  branch_id?: number | null;
  api_user_id?: number | null;
  product_id?: number | null;
}

export const fetchOrdersListing = async <T>({
  mode,
  startDate,
  endDate,
  month,
  order_status,
  policy_status,
  cnic,
  contact,
  payment_mode_id,
  branch_id,
  api_user_id,
  product_id,
}: fetchOrdersListingProps): Promise<T | null> => {
  const payload: {
    mode: string;
    date?: string;
    month: string | null;
    order_status?: string | null;
    policy_status?: string | null;
    cnic?: string | null;
    contact?: string | null;
    payment_mode_id?: number | null;
    branch_id?: number | null;
    api_user_id?: number | null;
    product_id?: number | null;
  } = {
    mode,
    month: month ?? null,
    cnic: cnic ?? null,
    contact: contact ?? null,
    payment_mode_id: payment_mode_id ?? null,
    branch_id: branch_id ?? null,
    product_id: product_id ?? null,
    api_user_id: api_user_id ?? null,
    ...(mode === 'orders' ? { order_status: order_status ?? null } : { policy_status: policy_status ?? null }),
  };

  if (startDate && endDate) {
    payload.date = `${startDate} to ${endDate}`;
  }

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/orders/list",
      data: payload,
    });

    return response as T;
  } catch (err) {
    console.error(`Error fetching ${mode} list listing:`, err);
    return null;
  }
};
