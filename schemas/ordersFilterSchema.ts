import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const monthsEnum = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export const orderStatusEnum = [
  "accepted",
  "cancelled",
  "pendingCOD",
  "rejected",
  "unverified",
  "verified",
  "pending",
] as const;

export const policyStatusEnum = [
  "cancelled",
  "HISposted",
  "IGISposted",
  "pendingIGIS",
  "unverified",
  "verified",
  "pending",
  "pendingCOD",
  "pendingCBO",
] as const;

export const OrdersFilterSchema = z.object({
  month: z
    .enum(monthsEnum, { required_error: "Please select a month." })
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Month contains forbidden code patterns",
    }),
  order_status: z
    .enum(orderStatusEnum, {
      required_error: "Please select order status.",
    })
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Order Status contains forbidden code patterns",
    }),
  policy_status: z
    .enum(policyStatusEnum, {
      required_error: "Please select policy status.",
    })
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Policy Status contains forbidden code patterns",
    }),
  api_user_id: z.coerce
    .number()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Api User contains forbidden code patterns",
    }),
  product_id: z.coerce
    .number()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Product forbidden code patterns",
    }),
  branch_id: z.coerce
    .number()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Branch contains forbidden code patterns",
    }),
  payment_mode_id: z.coerce
    .number()
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Payment Mode contains forbidden code patterns",
    }),
  cnic: z.coerce
    .string()
    .min(13, { message: "CNIC must be 13 digits without dashes." })
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "CNIC contains forbidden code patterns",
    }),
  contact: z.coerce
    .string()
    .nullable()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const phoneRegex = /^(03\d{9}|923\d{9})$/;
        return phoneRegex.test(val);
      },
      {
        message: "Invalid format. Use 03xxxxxxxxx or 923xxxxxxxxx.",
      }
    ),
});

export type OrdersFilterSchemaType = z.infer<typeof OrdersFilterSchema>;
