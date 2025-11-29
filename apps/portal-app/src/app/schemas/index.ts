import { z } from "zod";

export const CreateUserSchema = z.object({
    first_name: z.string().nonempty("First name is required."),
    last_name: z.string().nonempty("Last name is required."),
    // jobTitle: z.string().nonempty("Job title is required."),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    role_id: z.number({ required_error: "Role is required" }).int().positive("Role ID must be a positive number"),
})
export type CreateUserFormType = z.infer<typeof CreateUserSchema>

export const EditUserSchema = z.object({
    firstName: z.string().nonempty("First name is required."),
    lastName: z.string().nonempty("Last name is required."),
    // jobTitle: z.string().nonempty("Job title is required."),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    roleId: z.number({ required_error: "Role is required" }).int().positive("Role ID must be a positive number"),
})
export type EditUserFormType = z.infer<typeof EditUserSchema>
