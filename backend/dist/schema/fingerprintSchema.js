import { z } from "zod";
// =====================
// DATABASE ENTITY
// =====================
export const fingerprintEntitySchema = z.object({
    id: z.string(),
    fingerprintIndex: z.number().int(),
    employeeId: z.string(),
    deviceId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});
// =====================
// REQUESTS
// =====================
export const registerFingerprintSchema = z.object({
    fingerprintIndex: z.number().int(),
    employeeId: z.string().min(1),
    deviceId: z.string().min(1)
});
export const deleteFingerprintSchema = z.object({
    fingerprintIndex: z.number().int(),
    deviceId: z.string().min(1)
});
