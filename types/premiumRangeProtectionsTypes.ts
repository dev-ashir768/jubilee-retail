export type ApiUser = {
  id: number;
  name: string;
  api_password: string;
  email: string;
  phone: string;
  api_key: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: number | null;
};

export type CreatedBy = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  image: string;
  username: string;
  user_type: string;
  is_admin: boolean;
  is_active: boolean;
  is_deleted: boolean;
  email_verified_at: string;
  failed_attempt: number;
  lock_time: string | null;
  last_login_date: string;
  last_password_change: string | null;
  is_locked: boolean;
  otp_token: string | null;
  otp_time: string | null;
  password: string;
  remember_token: string | null;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: number | null;
};

export type PremiumRangeProtectionsPayloadType = {
  id: number;
  premium_start: string;
  premium_end: string;
  net_premium: string;
  api_user_id: number;
  duration: number;
  duration_type: string;
  is_active: true;
  is_deleted: false;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deletedBy: number | null;
  apiUser: ApiUser;
  createdBy: CreatedBy;
};
export type PremiumRangeProtectionsResponseType = {
  status: 1 | 0;
  message: string;
  payload: PremiumRangeProtectionsPayloadType[];
};
