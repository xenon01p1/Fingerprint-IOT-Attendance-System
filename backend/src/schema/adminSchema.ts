import { z } from "zod";
import { BaseResponseSchema } from "./baseSchema.js";

export const AdminSchema = z.object({
    id: z.string(),
    username: z.string().min(3).max(100),
    password: z.string().min(6),
    email: z.email(),
    phoneNumber: z.string().min(5).max(20),
    accessToken: z.string().nullable(),
    refreshToken: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const PublicAdminSchema = AdminSchema.pick({
    id: true,
    username: true,
    email: true,
    phoneNumber: true,
    accessToken: true,
    refreshToken: true,
    createdAt: true,
    updatedAt: true
});

// =========== REQUEST =============
export const adminIdSchema = AdminSchema.pick({
    id: true,
});
export type adminIdInput = z.infer<typeof adminIdSchema>;

export const createAdminSchema = AdminSchema.pick({
    username: true,
    password: true,
    email: true,
    phoneNumber: true
});
export type createAdminInput = z.infer<typeof createAdminSchema>;

export const updateAdminSchema = createAdminSchema.partial();
export type updateAdminInput = z.infer<typeof updateAdminSchema>;


// =========== PAGINATION SCHEMA =============
const paginationSchema = z.object({
    currentPage: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number()
});

// =========== DATA OBJECTS (INNER SCHEMAS) =============
const adminIdDataSchema = AdminSchema.pick({
    id: true,
});

const singleAdminDataSchema = AdminSchema.pick({
    id: true,
    username: true,
    email: true,
    phoneNumber: true,
    createdAt: true,
    updatedAt: true
});

const allAdminDataSchema = z.array(singleAdminDataSchema);


// =========== BASE RESPONSES =============
export const adminIdResponseSchema = BaseResponseSchema(adminIdDataSchema);
export type adminIdResponse = z.infer<typeof adminIdResponseSchema>;

export const singleAdminResponseSchema = BaseResponseSchema(singleAdminDataSchema);
export type singleAdminResponse = z.infer<typeof singleAdminResponseSchema>;

const allAdminDataWithPaginationSchema = z.object({
    items: allAdminDataSchema,
    pagination: paginationSchema
});

export const allAdminResponseSchema = BaseResponseSchema(allAdminDataWithPaginationSchema);
export type allAdminResponse = z.infer<typeof allAdminResponseSchema>;