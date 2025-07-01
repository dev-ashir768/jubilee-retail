export interface Branch {
  id: string;
  branchName: string;
  managerFirstName: string;
  managerLastName: string;
  username: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface BranchFormData {
  branchName: string;
  managerFirstName: string;
  managerLastName: string;
  username: string;
}

export interface UserOption {
  value: string;
  label: string;
}