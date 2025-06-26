export type user_info = {
  id: number;
  username: string;
  fullname: string;
  email: string;
  contact: string;
  isActive: boolean;
  image: string;
};

export type menus = {
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
};

export type verifyOtpPayload = {
  token: string;
  user_info: user_info;
  menus: menus[];
};

export interface verifyOtpResponseType {
  status: 1 | 0;
  message: string;
  payload: verifyOtpPayload[];
}
