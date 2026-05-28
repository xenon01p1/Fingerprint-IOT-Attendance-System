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

export type FingerprintEntity =
    z.infer<typeof fingerprintEntitySchema>;

// =====================
// REQUESTS
// =====================

export const registerFingerprintSchema = z.object({
    fingerprintIndex: z.number().int(),
    employeeId: z.string().min(1),
    deviceId: z.string().min(1)
});

export type RegisterFingerprintInput =
    z.infer<typeof registerFingerprintSchema>;

export const deleteFingerprintSchema = z.object({
    fingerprintIndex: z.number().int(),
    deviceId: z.string().min(1)
});

export type DeleteFingerprintInput =
    z.infer<typeof deleteFingerprintSchema>;