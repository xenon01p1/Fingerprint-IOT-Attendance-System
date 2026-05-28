import LogDeviceRepository from "../repositories/logDeviceRepo.js";
import { AppError } from "../middlewares/globalErrorMiddleware.js";

class LogDeviceService {
    constructor(private logDeviceRepo: LogDeviceRepository) {}

    async getAllLogDeviceService(page: number = 1, pageSize: number = 10) {
        try {
            // Validate pagination params
            const validPage = Math.max(1, page);
            const validPageSize = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
            
            const skip = (validPage - 1) * validPageSize;
            const take = validPageSize;

            const logDeviceData = await this.logDeviceRepo.getAllLogDevice(skip, take);
            const totalItems = await this.logDeviceRepo.getLogDeviceCount();
            
            if (!Array.isArray(logDeviceData)) {
                throw new AppError("Failed to retrieve log device data", 500);
            }

            const totalPages = Math.ceil(totalItems / validPageSize);

            return {
                items: logDeviceData.map(logDevice => ({
                    id: logDevice.id,
                    type: logDevice.type,
                    fingerprintId: logDevice.fingerprintId,
                    fingerprint: logDevice.fingerprint,
                    createdAt: logDevice.createdAt
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
            throw new AppError(error instanceof Error ? error.message : "Failed to retrieve log device records", 500);
        }
    }

    async getLogDeviceService(logDeviceId: string) {
        const logDeviceData = await this.logDeviceRepo.getLogDevice(logDeviceId);
        
        if (!logDeviceData) {
            throw new Error("Log device record not found");
        }

        return {
            id: logDeviceData.id,
            type: logDeviceData.type,
            fingerprintId: logDeviceData.fingerprintId,
            fingerprint: logDeviceData.fingerprint,
            createdAt: logDeviceData.createdAt
        };
    }

    async createLogDeviceService(data: {
        type: "register" | "finishRegister" | "checkIn" | "checkOut" | "delete";
        fingerprintId: string;
        deviceId: string;
    }) {
        const createLogDeviceResult = await this.logDeviceRepo.createLogDevice(data);
        
        if (!createLogDeviceResult) {
            throw new Error("Failed to create log device record");
        }

        return {
            id: createLogDeviceResult.id,
            type: createLogDeviceResult.type,
            fingerprintId: createLogDeviceResult.fingerprintId,
            fingerprint: createLogDeviceResult.fingerprint,
            createdAt: createLogDeviceResult.createdAt
        };
    }
}

export default LogDeviceService;
