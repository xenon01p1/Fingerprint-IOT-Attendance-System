import { z } from "zod";
import { BaseResponseSchema } from "./baseSchema.js";

export const EmployeeSchema = z.object({
    id: z.string(),
    employeeNumber: z.number().int(),
    fullname: z.string().min(3).max(100),
    username: z.string().min(3).max(100),
    password: z.string().min(6),
    email: z.string().email(),
    phoneNumber: z.string().min(5).max(20),
    refreshToken: z.string().nullable(),
    role: z.enum(["regular", "supervisor"]),
    employeeStatus: z.enum(["active", "onLeave", "resigned"]),
    status: z.enum(["active", "banned", "deleted"]),
    companyId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// =========== REQUEST =============
export const employeeIdSchema = EmployeeSchema.pick({
    id: true,
});
export type employeeIdInput = z.infer<typeof employeeIdSchema>;

export const createEmployeeSchema = EmployeeSchema.pick({
    employeeNumber: true,
    fullname: true,
    username: true,
    password: true,
    email: true,
    phoneNumber: true,
    role: true,
    employeeStatus: true,
    status: true,
    companyId: true
}).partial({
    role: true,
    employeeStatus: true,
    status: true
});
export type createEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();
export type updateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

// =========== DATA OBJECTS (INNER SCHEMAS) =============
const employeeIdDataSchema = EmployeeSchema.pick({
    id: true,
});

const singleEmployeeDataSchema = EmployeeSchema.pick({
    id: true,
    employeeNumber: true,
    fullname: true,
    username: true,
    email: true,
    phoneNumber: true,
    role: true,
    employeeStatus: true,
    status: true,
    companyId: true,
    createdAt: true,
    updatedAt: true
});

const allEmployeeDataSchema = z.array(singleEmployeeDataSchema);

// =========== BASE RESPONSES =============
export const employeeIdResponseSchema = BaseResponseSchema(employeeIdDataSchema);
export type employeeIdResponse = z.infer<typeof employeeIdResponseSchema>;

export const singleEmployeeResponseSchema = BaseResponseSchema(singleEmployeeDataSchema);
export type singleEmployeeResponse = z.infer<typeof singleEmployeeResponseSchema>;

export const allEmployeeResponseSchema = BaseResponseSchema(allEmployeeDataSchema);
export type allEmployeeResponse = z.infer<typeof allEmployeeResponseSchema>;