import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const menu_rights = z.object({
  menu_id: z.number({ invalid_type_error: "Menu ID must be a number" }),
  can_view: z.boolean(),
  can_create: z.boolean(),
  can_edit: z.boolean(),
  can_delete: z.boolean(),
});

export const EditUserSchema = z.object({
  username: z
    .string({ invalid_type_error: "Username must be a string" })
    .trim()
    .min(3, { message: "Username cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  fullname: z
    .string({ invalid_type_error: "Fullname must be a string" })
    .trim()
    .min(3, { message: "Fullname cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^03[0-4][0-9]{8}$/, {
      message: "Phone must be a valid Pakistani phone number",
    })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  password: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z.union([
        z.literal(""),
        z
          .string()
          .min(8, { message: "Password must be at least 8 characters long" })
          .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
          })
          .regex(/[0-9]/, { message: "Password must contain at least one number" })
          .regex(/[!@#$%^&*]/, {
            message: "Password must contain at least one special character",
          })
          .refine((val) => !forbiddenCodeRegex.test(val), {
            message: "Invalid input: Code-like content is not allowed",
          }),
      ])
    ),
  redirection_url: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val))
    .refine((val) => val === null || !forbiddenCodeRegex.test(val!), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  image: z.string().optional(),
  user_type: z.enum(["api_user", "dashboard_user"], {
    required_error: "User type is required",
  }),
  menu_rights: menu_rights.array(),
  user_id: z.number().optional(),
  is_active: z.boolean({ required_error: "Status is required" }),
  is_locked: z.boolean({ required_error: "Lock Status is required" }).optional(),
});
export type EditUserSchemaType = z.infer<typeof EditUserSchema>;