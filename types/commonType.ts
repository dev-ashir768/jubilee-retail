export type DeletePayloadType = any;
export type DeleteResponseType = {
  status: 1 | 0;
  message: string;
  payload: DeletePayloadType;
};

export type StatusPayloadType = any;
export type StatusResponseType = {
  status: 1 | 0;
  message: string;
  payload: StatusPayloadType;
};
