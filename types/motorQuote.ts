export type MotorQuotePayloadTypes = {
  id: number;
  quote_id: string;
  policy_type: string;
  name: string;
  mobile: string;
  email: string;
  premium_value: string;
  rate: string;
  vehicle_make: string;
  vehicle_submake: string;
  vehicle_model: string;
  vehicle_value: string;
  vehicle_track: string;
  vehicle_body: string;
  vehicle_color: string;
  reg_no: string;
  engine_no: string;
  chassis_no: string;
  status: string;
  city_id: string;
  agent_id: number;
  branch_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type MotorQuoteResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: MotorQuotePayloadTypes[];
};
