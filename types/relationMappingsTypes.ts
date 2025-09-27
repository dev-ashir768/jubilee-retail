export type RelationMappingsPayloadTypes = {
  id: number;
  name: string;
  short_key: string;
  gender: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type RelationMappingsResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: RelationMappingsPayloadTypes[];
};
