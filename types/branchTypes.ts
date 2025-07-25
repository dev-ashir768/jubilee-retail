export type BranchPayloadType = {
  id: number;
  name: string;
  igis_branch_code: string;
  igis_branch_takaful_code: string;
  address: string;
  telephone: string;
  email: string;
  his_code: string;
  his_code_takaful: string;
  sales_tax_perc: string;
  fed_insurance_fee: string;
  website: string;
  igis_takaful_code: string;
  phone: string;
  stamp_duty: number;
  admin_rate: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
export type BranchResponseType = {
  status: 1 | 0;
  message: string;
  payload: BranchPayloadType[];
};
