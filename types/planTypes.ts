export type PlanPayloadTypes = {
  id: number;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type PlanResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: PlanPayloadTypes[];
};
