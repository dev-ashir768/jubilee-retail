export type DoListPayloadType = {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to: number;
  assigned_user?: {
    id: number;
    fullname: string;
    username: string;
  };
  is_active: boolean;
  is_deleted: boolean;
  created_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type DoListResponseType = {
  status: 1 | 0;
  message: string;
  payload: DoListPayloadType[];
}

export interface DoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to: number;
}

export interface UserOption {
  value: number;
  label: string;
}