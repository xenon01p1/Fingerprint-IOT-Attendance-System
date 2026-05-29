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

// =========== REQUEST =============



// =========== RESPONSE ============
