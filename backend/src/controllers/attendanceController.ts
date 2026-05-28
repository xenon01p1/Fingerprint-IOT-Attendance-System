import AttendanceService from "../services/attendanceService.js";
import type { Request, Response, NextFunction } from "express";

interface AttendanceListResponse {
    status: boolean;
    message: string;
    data: {
        items: any[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
        };
    };
}

interface SingleAttendanceResponse {
    status: boolean;
    message: string;
    data: any;
}

class AttendanceController {
    constructor(private attendanceService: AttendanceService) {}

    getAllAttendanceController = async (
        req: Request<{}, AttendanceListResponse, {}>,
        res: Response<AttendanceListResponse>,
        next: NextFunction
    ) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            
            const result = await this.attendanceService.getAllAttendanceService(page, pageSize);

            res.status(200).json({
                status: true,
                message: "Attendance records retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    getAttendanceController = async (
        req: Request<{ attendanceId: string }, SingleAttendanceResponse, {}>,
        res: Response<SingleAttendanceResponse>,
        next: NextFunction
    ) => {
        try {
            const { attendanceId } = req.params;
            const attendance = await this.attendanceService.getAttendanceService(attendanceId);

            res.status(200).json({
                status: true,
                message: "Attendance record retrieved successfully",
                data: attendance
            });
        } catch (error) {
            next(error);
        }
    };

    createAttendanceController = async (
        req: Request<{}, SingleAttendanceResponse, { type: "checkIn" | "checkOut"; employeeId: string; deviceId?: string }>,
        res: Response<SingleAttendanceResponse>,
        next: NextFunction
    ) => {
        try {
            const { type, employeeId, deviceId } = req.body;
            const newAttendance = await this.attendanceService.createAttendanceService({
                type,
                employeeId,
                deviceId
            });

            res.status(201).json({
                status: true,
                message: "Attendance record created successfully",
                data: newAttendance
            });
        } catch (error) {
            next(error);
        }
    };
}

export default AttendanceController;
