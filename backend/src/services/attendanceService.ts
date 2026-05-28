import AttendanceRepository from "../repositories/attendanceRepo.js";
import { AppError } from "../middlewares/globalErrorMiddleware.js";

class AttendanceService {
    constructor(private attendanceRepo: AttendanceRepository) {}

    async getAllAttendanceService(page: number = 1, pageSize: number = 10) {
        try {
            // Validate pagination params
            const validPage = Math.max(1, page);
            const validPageSize = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
            
            const skip = (validPage - 1) * validPageSize;
            const take = validPageSize;

            const attendanceData = await this.attendanceRepo.getAllAttendance(skip, take);
            const totalItems = await this.attendanceRepo.getAttendanceCount();
            
            if (!Array.isArray(attendanceData)) {
                throw new AppError("Failed to retrieve attendance data", 500);
            }

            const totalPages = Math.ceil(totalItems / validPageSize);

            return {
                items: attendanceData.map(attendance => ({
                    id: attendance.id,
                    type: attendance.type,
                    employee: attendance.employee,
                    device: attendance.device,
                    createdAt: attendance.createdAt
                })),
                pagination: {
                    currentPage: validPage,
                    pageSize: validPageSize,
                    totalItems,
                    totalPages
                }
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(error instanceof Error ? error.message : "Failed to retrieve attendance records", 500);
        }
    }

    async getAttendanceService(attendanceId: string) {
        const attendanceData = await this.attendanceRepo.getAttendance(attendanceId);
        
        if (!attendanceData) {
            throw new Error("Attendance record not found");
        }

        return {
            id: attendanceData.id,
            type: attendanceData.type,
            employee: attendanceData.employee,
            device: attendanceData.device,
            createdAt: attendanceData.createdAt
        };
    }

    async createAttendanceService(data: {
        type: "checkIn" | "checkOut";
        employeeId: string;
        deviceId?: string;
    }) {
        const createAttendanceResult = await this.attendanceRepo.createAttendance(data);
        
        if (!createAttendanceResult) {
            throw new Error("Failed to create attendance record");
        }

        return {
            id: createAttendanceResult.id,
            type: createAttendanceResult.type,
            employee: createAttendanceResult.employee,
            device: createAttendanceResult.device,
            createdAt: createAttendanceResult.createdAt
        };
    }
}

export default AttendanceService;
