// api user

export type UsersListPayloadType = {
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
  lock_time: number | null;
  last_login_date: string;
  last_password_change: number | null;
  is_locked: boolean;
  otp_token: number | null;
  otp_time: number | null;
  password: string;
  remember_token: number | null;
  created_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: number | null;
};

export type UsersListResponseType = {
  status: 1 | 0;
  message: string;
  payload: UsersListPayloadType[];
};

// api user

export type ApiUsersPayloadType = {
  id: number;
  name: string;
  api_password: string;
  email: string;
  phone: string;
  api_key: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number | null;
  deleted_by: number | null;
  user_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ApiUsersResponseType = {
  status: 1 | 0;
  message: string;
  payload: ApiUsersPayloadType[];
};

// user profile

export type UserProfilePayloadType = {
  id: number;
  username: string;
  fullname: string;
  email: string;
  contact: string;
  image: string;
  isActive: boolean;
  lastLoginDate: string;
};

export type UserProfileResponseType = {
  status: 1 | 0;
  message: string;
  payload: UserProfilePayloadType[];
};
