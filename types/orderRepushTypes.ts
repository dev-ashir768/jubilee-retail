export type OrderRepushTypesPayloadType = {
  policy_code: string;
};

export type OrderRepushResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: OrderRepushTypesPayloadType[];
};
