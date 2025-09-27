export type LeadMotorInfoPayloadTypes = {
  id: number;
  full_name: string;
  policy_type: string | null;
  mobile: string;
  email: string;
  vehicle_make: string;
  vehicle_submake: string;
  vehicle_model: string;
  vehicle_value: string;
  vehicle_track_yesno: boolean;
  vehicle_track: string;
  premium: string | null;
  status: string;
  created_by: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type LeadMotorInfoResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: LeadMotorInfoPayloadTypes[];
};
