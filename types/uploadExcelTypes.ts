export type ExcelDataExpectedRow = {
  // Core required fields
  policy_no: string;
  partner_name: string;
  payment_mode: string;
  plan: string;
  order_no: string;
  client_name: string;
  client_cnic: string;
  client_dob: string;
  client_email: string;
  client_cnic_issue_date: string;
  client_contact_no: string;
  address: string;
  start_date: string;
  expiry_date: string;
  gender: string;
  client_occupation: string;
  premium: number;
  beneficiary_name: string;
  beneficiary_relation: string;

  // Additional spouses (conditional)
  spouse_name?: string;
  spouse_cnic?: string;
  spouse_dob?: string;
  spouse_relationship?: string;
  spouse_gender?: string;
  spouse_cnic_issue_date?: string;

  spouse1_name?: string;
  spouse1_cnic?: string;
  spouse1_dob?: string;
  spouse1_relationship?: string;
  spouse1_gender?: string;
  spouse1_cnic_issue_date?: string;

  spouse2_name?: string;
  spouse2_cnic?: string;
  spouse2_dob?: string;
  spouse2_relationship?: string;
  spouse2_gender?: string;
  spouse2_cnic_issue_date?: string;

  spouse3_name?: string;
  spouse3_cnic?: string;
  spouse3_dob?: string;
  spouse3_relationship?: string;
  spouse3_gender?: string;
  spouse3_cnic_issue_date?: string;

  // Rider (conditional)
  rider1_covered?: string;
  rider1_sum_assured?: number;

  rider2_covered?: string;
  rider2_sum_assured?: number;

  // Kids (conditional)
  kid1_name?: string;
  kid1_dob?: string;
  kid1_relationship?: string;
  kid1_gender?: string;
  kid1_cnic?: string;
  kid1_cnic_issue_date?: string;

  kid2_name?: string;
  kid2_dob?: string;
  kid2_relationship?: string;
  kid2_gender?: string;
  kid2_cnic?: string;
  kid2_cnic_issue_date?: string;

  kid3_name?: string;
  kid3_dob?: string;
  kid3_relationship?: string;
  kid3_gender?: string;
  kid3_cnic?: string;
  kid3_cnic_issue_date?: string;

  kid4_name?: string;
  kid4_dob?: string;
  kid4_relationship?: string;
  kid4_gender?: string;
  kid4_cnic?: string;
  kid4_cnic_issue_date?: string;

  kid5_name?: string;
  kid5_dob?: string;
  kid5_relationship?: string;
  kid5_gender?: string;
  kid5_cnic?: string;
  kid5_cnic_issue_date?: string;

  kid6_name?: string;
  kid6_dob?: string;
  kid6_relationship?: string;
  kid6_gender?: string;
  kid6_cnic?: string;
  kid6_cnic_issue_date?: string;

  kid7_name?: string;
  kid7_dob?: string;
  kid7_relationship?: string;
  kid7_gender?: string;
  kid7_cnic?: string;
  kid7_cnic_issue_date?: string;

  kid8_name?: string;
  kid8_dob?: string;
  kid8_relationship?: string;
  kid8_gender?: string;
  kid8_cnic?: string;
  kid8_cnic_issue_date?: string;
};
