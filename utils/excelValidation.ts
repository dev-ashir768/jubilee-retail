
import { ExcelDataExpectedRow } from "@/types/uploadExcelTypes";

// Core required keys (100% expected, including base spouse)
export const CORE_KEYS: (keyof ExcelDataExpectedRow)[] = [
  "policy_no",
  "partner_name",
  "payment_mode",
  "plan",
  "order_no",
  "client_name",
  "client_cnic",
  "client_dob",
  "client_email",
  "client_cnic_issue_date",
  "client_contact_no",
  "address",
  "start_date",
  "expiry_date",
  "gender",
  "client_occupation",
  "premium",
  "beneficiary_name",
  "beneficiary_relation",
];

// Rider groups (if one filled, other required)
export const RIDERS_GROUPS = [
  {
    covered: "rider1_covered" as const,
    assured: "rider1_sum_assured" as const,
  },
  {
    covered: "rider2_covered" as const,
    assured: "rider2_sum_assured" as const,
  },
];

// Kids groups (full: kid1 to kid8 - if any one filled, all required)
export const KID_GROUPS = [
  [
    "kid1_name",
    "kid1_dob",
    "kid1_relationship",
    "kid1_gender",
    "kid1_cnic",
    "kid1_cnic_issue_date",
  ],
  [
    "kid2_name",
    "kid2_dob",
    "kid2_relationship",
    "kid2_gender",
    "kid2_cnic",
    "kid2_cnic_issue_date",
  ],
  [
    "kid3_name",
    "kid3_dob",
    "kid3_relationship",
    "kid3_gender",
    "kid3_cnic",
    "kid3_cnic_issue_date",
  ],
  [
    "kid4_name",
    "kid4_dob",
    "kid4_relationship",
    "kid4_gender",
    "kid4_cnic",
    "kid4_cnic_issue_date",
  ],
  [
    "kid5_name",
    "kid5_dob",
    "kid5_relationship",
    "kid5_gender",
    "kid5_cnic",
    "kid5_cnic_issue_date",
  ],
  [
    "kid6_name",
    "kid6_dob",
    "kid6_relationship",
    "kid6_gender",
    "kid6_cnic",
    "kid6_cnic_issue_date",
  ],
  [
    "kid7_name",
    "kid7_dob",
    "kid7_relationship",
    "kid7_gender",
    "kid7_cnic",
    "kid7_cnic_issue_date",
  ],
  [
    "kid8_name",
    "kid8_dob",
    "kid8_relationship",
    "kid8_gender",
    "kid8_cnic",
    "kid8_cnic_issue_date",
  ],
] as const;

// Additional spouses groups (spouse1 to spouse3 - if any one filled, all required)
export const SPOUSE_GROUPS = [
  [
    "spouse_name",
    "spouse_dob",
    "spouse_relationship",
    "spouse_cnic_issue_date",
    "spouse_cnic",
    "spouse_gender",
  ],
  [
    "spouse1_name",
    "spouse1_dob",
    "spouse1_relationship",
    "spouse1_gender",
    "spouse1_cnic",
    "spouse1_cnic_issue_date",
  ],
  [
    "spouse2_name",
    "spouse2_dob",
    "spouse2_relationship",
    "spouse2_cnic",
    "spouse2_gender",
    "spouse2_cnic_issue_date",
  ],
  [
    "spouse3_name",
    "spouse3_dob",
    "spouse3_relationship",
    "spouse3_cnic",
    "spouse3_gender",
    "spouse3_cnic_issue_date",
  ],
] as const;

// Full DATE_KEYS list (all dates in type)
export const DATE_KEYS: (keyof ExcelDataExpectedRow)[] = [
  "client_dob",
  "client_cnic_issue_date",
  "start_date",
  "expiry_date",
  "spouse_dob",
  "spouse_cnic_issue_date",
  "spouse1_dob",
  "spouse1_cnic_issue_date",
  "spouse2_dob",
  "spouse2_cnic_issue_date",
  "spouse3_dob",
  "spouse3_cnic_issue_date",
  "kid1_dob",
  "kid1_cnic_issue_date",
  "kid2_dob",
  "kid2_cnic_issue_date",
  "kid3_dob",
  "kid3_cnic_issue_date",
  "kid4_dob",
  "kid4_cnic_issue_date",
  "kid5_dob",
  "kid5_cnic_issue_date",
  "kid6_dob",
  "kid6_cnic_issue_date",
  "kid7_dob",
  "kid7_cnic_issue_date",
  "kid8_dob",
  "kid8_cnic_issue_date",
];

// Number fields for coercion
export const NUMBER_KEYS: (keyof ExcelDataExpectedRow)[] = [
  "premium",
  "rider1_sum_assured",
  "rider2_sum_assured",
];

// All CNIC keys for validation
export const CNIC_KEYS: (keyof ExcelDataExpectedRow)[] = [
  "client_cnic",
  "spouse_cnic",
  "spouse1_cnic",
  "spouse2_cnic",
  "spouse3_cnic",
  "kid1_cnic",
  "kid2_cnic",
  "kid3_cnic",
  "kid4_cnic",
  "kid5_cnic",
  "kid6_cnic",
  "kid7_cnic",
  "kid8_cnic",
];

const GENDER_KEYS: (keyof ExcelDataExpectedRow)[] = [
  "gender",
  "spouse_gender",
  "spouse1_gender",
  "spouse2_gender",
  "spouse3_gender",
  "kid1_gender",
  "kid2_gender",
  "kid3_gender",
  "kid4_gender",
  "kid5_gender",
  "kid6_gender",
  "kid7_gender",
  "kid8_gender",
];

// New helper: Format field names (e.g., "client_name" → "Client Name")
const formatFieldName = (key: string): string => {
  return key
    .replace(/_/g, " ") // Underscore to space
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
};

// Helper: Check if value is "filled" (same as before)
const isFilled = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return !isNaN(value) && value !== 0; // Adjust if 0 is valid
  return !!value;
};

// Main validation function
export const validateRow = (
  row: Partial<ExcelDataExpectedRow>,
  rowIndex: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 1. Core check
  CORE_KEYS.forEach((key) => {
    const value = row[key];
    if (!isFilled(value)) {
      errors.push(
        `Row ${rowIndex + 1}: Missing or empty core field - ${formatFieldName(
          key
        )}`
      );
    }
  });

  // 1.1 Specific validation for payment_mode - must be exactly "B2B"
  const paymentMode = row["payment_mode"];
  if (
    isFilled(paymentMode) &&
    paymentMode?.replace(" ", "").toLocaleUpperCase() !== "B2B"
  ) {
    errors.push(`Row ${rowIndex + 1}: Invalid payment mode - must be 'B2B'`);
  }

  // 1.2 Specific validation for all CNIC fields - exactly 13 digits, no dashes, must be string
  CNIC_KEYS.forEach((key) => {
    const cnicValue = row[key];
    if (isFilled(cnicValue)) {
      let cnicStr: string;
      if (typeof cnicValue === "string") {
        cnicStr = cnicValue.replace(/[-\s]/g, "");
      } else {
        // If not string, convert to string and validate
        cnicStr = String(cnicValue).replace(/[-\s]/g, "");
      }
      const cnicRegex = /^\d{13}$/;
      if (!cnicRegex.test(cnicStr)) {
        errors.push(
          `Row ${rowIndex + 1}: ${formatFieldName(
            key
          )} must be a string of exactly 13 digits without dashes`
        );
      }
    }
  });

  // 1.3 Enhanced gender validation (after core check)
  GENDER_KEYS.forEach((key) => {
    const value = row[key];
    if (isFilled(value) && typeof value === "string") {
      const normalized = value.toLowerCase().trim();
      if (!["male", "female", "others"].includes(normalized)) {
        errors.push(
          `Row ${rowIndex + 1}: Invalid value in ${formatFieldName(
            key
          )} - must be 'male', 'female', or 'others' (case-insensitive)`
        );
      }
    }
  });

  // 2. Number validation
  NUMBER_KEYS.forEach((key) => {
    const value = row[key];
    if (isFilled(value) && typeof value !== "number") {
      const parsed = Number(value);
      if (isNaN(parsed)) {
        errors.push(
          `Row ${rowIndex + 1}: Invalid number in ${formatFieldName(
            key
          )} - must be numeric`
        );
      }
    }
  });

  // 3. Date format validation
  DATE_KEYS.forEach((key) => {
    const value = row[key];
    if (isFilled(value)) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (typeof value === "string" && !dateRegex.test(value)) {
        errors.push(
          `Row ${rowIndex + 1}: Invalid date format in ${formatFieldName(
            key
          )} - use YYYY-MM-DD`
        );
      }
    }
  });

  // 4. Riders (errors)
  RIDERS_GROUPS.forEach((group) => {
    const covered = row[group.covered];
    const assured = row[group.assured];
    const hasCovered = isFilled(covered);
    const hasAssured = isFilled(assured);

    if (hasCovered && !hasAssured) {
      errors.push(
        `Row ${rowIndex + 1}: ${formatFieldName(
          group.assured
        )} required when ${formatFieldName(group.covered)} is filled`
      );
    } else if (!hasCovered && hasAssured) {
      errors.push(
        `Row ${rowIndex + 1}: ${formatFieldName(
          group.covered
        )} required when ${formatFieldName(group.assured)} is filled`
      );
    }
  });

  // 5. Conditional groups (errors)

  // --- SPOUSE GROUPS (All fields required if any is filled) ---
  SPOUSE_GROUPS.forEach((group) => {
    const groupNumMatch = group[0].match(/\d+/);
    const groupNum = groupNumMatch
      ? groupNumMatch[0]
      : group[0].includes("spouse_")
      ? ""
      : "1";
    const groupName = groupNum ? `Spouse ${groupNum}` : "Spouse";

    const filledFields = group.filter((key) =>
      isFilled(row[key as keyof ExcelDataExpectedRow])
    );

    // If any field is filled, all fields in that spouse group must be filled
    if (filledFields.length > 0 && filledFields.length < group.length) {
      const missing = group
        .filter((key) => !filledFields.includes(key))
        .map(formatFieldName);
      const triggerField = formatFieldName(filledFields[0]);
      errors.push(
        `Row ${
          rowIndex + 1
        }: ${groupName} group incomplete - missing ${missing.join(
          ", "
        )} (triggered by ${triggerField})`
      );
    }
  });

  // --- KID GROUPS (CNIC and Issue Date are optional) ---
  KID_GROUPS.forEach((group) => {
    const groupNumMatch = group[0].match(/\d+/);
    const groupNum = groupNumMatch ? groupNumMatch[0] : "1";
    const groupName = `Kid ${groupNum}`;

    // Define which fields are core requirements for kids
    // name, dob, relationship, gender
    const coreKidFields = [group[0], group[1], group[2], group[3]];

    // Check if ANY field in the entire kid group is filled (including optional cnic/date)
    const anyFieldFilled = group.some((key) =>
      isFilled(row[key as keyof ExcelDataExpectedRow])
    );

    if (anyFieldFilled) {
      // If any field is filled, check if all CORE fields are filled
      const missingCoreFields = coreKidFields
        .filter((key) => !isFilled(row[key as keyof ExcelDataExpectedRow]))
        .map(formatFieldName);

      if (missingCoreFields.length > 0) {
        // Find the first filled field to use as the "trigger" in the error message
        const triggerFieldKey = group.find((key) =>
          isFilled(row[key as keyof ExcelDataExpectedRow])
        );
        const triggerField = formatFieldName(triggerFieldKey || group[0]);

        errors.push(
          `Row ${
            rowIndex + 1
          }: ${groupName} group incomplete - missing ${missingCoreFields.join(
            ", "
          )} (triggered by ${triggerField})`
        );
      }
    }
  });

  const valid = errors.length === 0;
  return { valid, errors }; // Return errors only
};
