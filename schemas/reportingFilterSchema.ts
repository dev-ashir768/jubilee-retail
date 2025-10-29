import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const ReportingFilterSchema = z.object({
  policy_code: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Policy Code contains forbidden code patterns",
    }),
  order_id: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Order Id contains forbidden code patterns",
    }),
  customer_firstname: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Customer Firstname contains forbidden code patterns",
    }),
  customer_lastname: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Customer Lastname contains forbidden code patterns",
    }),
  customer_cnic: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Customer CNIC contains forbidden code patterns",
    }),
  customer_city: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Customer City contains forbidden code patterns",
    }),
  customer_email: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Customer Email contains forbidden code patterns",
    }),
  coupon_code: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Coupon Code contains forbidden code patterns",
    }),
  tracking_number: z
    .string()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Tracking Number contains forbidden code patterns",
    }),
  policy_status: z
    .array(z.string())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Policy Status forbidden code patterns",
    }),
  agentids: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Agents forbidden code patterns",
    }),
  branchids: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Branches forbidden code patterns",
    }),
  clientids: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Clients forbidden code patterns",
    }),
  doids: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "DOs forbidden code patterns",
    }),
  productids: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Products forbidden code patterns",
    }),
  planids: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Plans forbidden code patterns",
    }),
  partnerids: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Partners forbidden code patterns",
    }),
});

export type ReportingFilterSchemaType = z.infer<typeof ReportingFilterSchema>;
