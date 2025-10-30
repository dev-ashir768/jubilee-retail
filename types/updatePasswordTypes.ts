export type UploadPasswordPayloadTypes = {
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
  redirection_url: string | null;
  failed_attempt: number;
  lock_time: string | null;
  last_login_date: string;
  last_password_change: string | null;
  is_locked: boolean;
  otp_token: string | null;
  otp_time: string | null;
  password: string;
  remember_token: null;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type UploadPasswordResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: UploadPasswordPayloadTypes[];
};
