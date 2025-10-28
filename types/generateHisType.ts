export type GenerateHISPayloadTypes = {
  his_retail_zip: string;
};

export type GenerateHISResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: GenerateHISPayloadTypes[];
};
