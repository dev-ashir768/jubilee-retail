export type userInfoTypes = {
  id: number;
  username: string;
  fullname: string;
  email: string;
  contact: string;
  isActive: boolean;
  image: string;
  redirection_url: string | null;
  userType: "api_user" | "dashboard_user";
  is_active: boolean;
  is_locked: boolean;
};

export type menusTypes = {
  menu_id: number;
  menu_name: string;
  icon: string;
  sorting: number;
  url: string;
  parent_id: number | null;
  can_view: "1" | "0";
  can_create: "1" | "0";
  can_edit: "1" | "0";
  can_delete: "1" | "0";
  items?: menusTypes[];
};

export type verifyOtpPayload = {
  token: string;
  user_info: userInfoTypes;
  menus: menusTypes[];
};

export interface verifyOtpResponseType {
  status: 1 | 0;
  message: string;
  payload: verifyOtpPayload[];
}
