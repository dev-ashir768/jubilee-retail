export type OrderVerifyManuallyPayloadType = {
  policy_code: string;
};

export type OrderVerifyManuallyResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: OrderVerifyManuallyPayloadType[];
};
