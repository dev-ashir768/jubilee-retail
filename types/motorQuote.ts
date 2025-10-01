export type MotorQuotePayloadTypes = {
  id: number;
  quote_id: "MQ-10000760";
  policy_type: "Old Cars Comprehensive";
  name: string | null;
  mobile: string | null;
  email: string | null;
  premium_value: number;
  rate: number | null;
  vehicle_make: string | null;
  vehicle_submake: string | null;
  vehicle_model: string | null;
  vehicle_value: string | null;
  vehicle_track: string | null;
  vehicle_body: string | null;
  vehicle_color: string | null;
  reg_no: string | null;
  engine_no: string | null;
  chassis_no: string | null;
  status: string | null;
  city_id: string | null;
  agent_id: string | null;
  branch_id: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MotorQuoteResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: MotorQuotePayloadTypes[];
};
