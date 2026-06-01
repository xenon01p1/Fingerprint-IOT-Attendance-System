import { z } from "zod";
import { BaseResponseSchema } from "./baseSchema.js";
export const DeviceSchema = z.object({
    id: z.string(),
    name: z.string().min(3),
    address: z.string(),
    location: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    companyId: z.string(),
    isDeleted: z.boolean()
});
const allDeviceSchema = z.array(DeviceSchema);
const deviceIdSchema = DeviceSchema.pick({ id: true });
// ---------- PAGINATION SCHEMA =============
const paginationSchema = z.object({
    currentPage: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number()
});
// =========== REQUEST =============
export const createDeviceSchema = DeviceSchema.pick({
    name: true,
    address: true,
    location: true,
    companyId: true
});
export const updateDeviceSchema = DeviceSchema.pick({
    name: true,
    address: true,
    location: true,
    companyId: true,
    updatedAt: true
});
// =========== RESPONSE ============
const getAllDevicePaginationSchema = z.object({
    items: allDeviceSchema,
    pagination: paginationSchema
});
const getAllDeviceResponseSchema = BaseResponseSchema(getAllDevicePaginationSchema);
// export const createDeviceResponseSchema = BaseResponseSchema(createDeviceSchema);
// export type createDeviceResponse = z.infer<typeof createDeviceResponseSchema>;
export const deviceIdResponseSchema = BaseResponseSchema(deviceIdSchema);
