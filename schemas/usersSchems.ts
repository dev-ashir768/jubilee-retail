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

export const usersSchema = z.object({
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
    .string({ invalid_type_error: "Fullname must be a string" })
    .regex(/^03[0-4][0-9]{8}$/, {
      message: "Phone must be a valid Pakistani phone number",
    })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*]/, {
      message: "Password must contain at least one special character",
    })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  image: z.string().trim().optional(),
  user_type: z
    .enum(["dashboard_user", "api_user"], {
      invalid_type_error:
        "User type must be either 'dashboard_user' or 'api_user'",
    })
    .transform((val) => val.trim()),
  is_active: z.boolean(),
  created_by: z.number({ invalid_type_error: "Created by must be a number" }),
  menu_rights: menu_rights.array(),
});

export type UsersSchemaType = z.infer<typeof usersSchema>;
