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

const orderStatusEnum = [
  "accepted",
  "cancelled",
  "pendingCOD",
  "rejected",
  "unverified",
  "verified",
  "pending",
] as const;

export const OrdersListFilterSchema = z.object({
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
});

export type OrdersListFilterSchemaType = z.infer<typeof OrdersListFilterSchema>;
