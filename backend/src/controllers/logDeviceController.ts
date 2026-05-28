import LogDeviceService from "../services/logDeviceService.js";
import type { Request, Response, NextFunction } from "express";

interface LogDeviceListResponse {
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

interface SingleLogDeviceResponse {
    status: boolean;
    message: string;
    data: any;
}

class LogDeviceController {
    constructor(private logDeviceService: LogDeviceService) {}

    getAllLogDeviceController = async (
        req: Request<{}, LogDeviceListResponse, {}>,
        res: Response<LogDeviceListResponse>,
        next: NextFunction
    ) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            
            const result = await this.logDeviceService.getAllLogDeviceService(page, pageSize);

            res.status(200).json({
                status: true,
                message: "Log device records retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    getLogDeviceController = async (
        req: Request<{ logDeviceId: string }, SingleLogDeviceResponse, {}>,
        res: Response<SingleLogDeviceResponse>,
        next: NextFunction
    ) => {
        try {
            const { logDeviceId } = req.params;
            const logDevice = await this.logDeviceService.getLogDeviceService(logDeviceId);

            res.status(200).json({
                status: true,
                message: "Log device record retrieved successfully",
                data: logDevice
            });
        } catch (error) {
            next(error);
        }
    };

    createLogDeviceController = async (
        req: Request<{}, SingleLogDeviceResponse, { type: "register" | "finishRegister" | "checkIn" | "checkOut" | "delete"; fingerprintId: string; deviceId: string }>,
        res: Response<SingleLogDeviceResponse>,
        next: NextFunction
    ) => {
        try {
            const { type, fingerprintId, deviceId } = req.body;
            const newLogDevice = await this.logDeviceService.createLogDeviceService({
                type,
                fingerprintId,
                deviceId
            });

            res.status(201).json({
                status: true,
                message: "Log device record created successfully",
                data: newLogDevice
            });
        } catch (error) {
            next(error);
        }
    };
}

export default LogDeviceController;
