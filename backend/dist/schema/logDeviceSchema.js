import { z } from "zod";
export const logDeviceSchema = z.object({
    id: z.string(),
    type: z.enum(["register", "finishRegister", "checkIn", "checkOut", "delete"]),
    fingerprintId: z.string(),
    fingerprint: z.object({
        id: z.string(),
        fingerPrintIndex: z.number(),
        employeeId: z.string(),
        deviceId: z.string()
    }),
    createdAt: z.date()
});
export const createLogDeviceSchema = z.object({
    type: z.enum(["register", "finishRegister", "checkIn", "checkOut", "delete"]),
    fingerprintId: z.string(),
    deviceId: z.string()
});
export const allLogDeviceResponse = z.object({
    status: z.boolean(),
    message: z.string(),
    data: z.object({
        items: z.array(logDeviceSchema),
        pagination: z.object({
            currentPage: z.number(),
            pageSize: z.number(),
            totalItems: z.number(),
            totalPages: z.number()
        })
    })
});
export const singleLogDeviceResponse = z.object({
    status: z.boolean(),
    message: z.string(),
    data: logDeviceSchema
});
export const logDeviceIdResponse = z.object({
    status: z.boolean(),
    message: z.string(),
    data: logDeviceSchema
});
