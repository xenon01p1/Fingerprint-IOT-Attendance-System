import { z } from "zod";
export const attendanceSchema = z.object({
    id: z.string(),
    type: z.enum(["checkIn", "checkOut"]),
    employee: z.object({
        id: z.string(),
        employeeNumber: z.number(),
        fullname: z.string(),
        username: z.string(),
        email: z.string()
    }),
    device: z.object({
        id: z.string(),
        name: z.string(),
        location: z.string()
    }).nullable(),
    createdAt: z.date()
});
export const createAttendanceSchema = z.object({
    type: z.enum(["checkIn", "checkOut"]),
    employeeId: z.string(),
    deviceId: z.string().optional()
});
export const allAttendanceResponse = z.object({
    status: z.boolean(),
    message: z.string(),
    data: z.object({
        items: z.array(attendanceSchema),
        pagination: z.object({
            currentPage: z.number(),
            pageSize: z.number(),
            totalItems: z.number(),
            totalPages: z.number()
        })
    })
});
export const singleAttendanceResponse = z.object({
    status: z.boolean(),
    message: z.string(),
    data: attendanceSchema
});
export const attendanceIdResponse = z.object({
    status: z.boolean(),
    message: z.string(),
    data: attendanceSchema
});
