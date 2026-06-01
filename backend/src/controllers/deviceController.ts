import DeviceService from "../services/deviceService.js";
import { Request, Response, NextFunction } from "express";
import type { 
    getAllDeviceResponse, 
    deviceIdResponse,
    createDeviceInput,
    updateDeviceInput
} from "../schema/deviceSchema.js";

class DeviceController {
    constructor(private deviceService: DeviceService) {}

    // Request(params, response, bod)
    getAllDevicesController = async (
        req: Request<{}, getAllDeviceResponse, {}>,
        res: Response<getAllDeviceResponse>,
        next: NextFunction
    ) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            const result = await this.deviceService.getAllDevicesService(page, pageSize);

            res.status(200).json({
                status: true,
                message: "Devices retrieved successfully",
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    createDeviceController = async(
        req: Request<{}, deviceIdResponse, createDeviceInput>,
        res: Response<deviceIdResponse>,
        next: NextFunction
    ) => {
        try {
            const createDevice = await this.deviceService.createDeviceService(req.body);

            res.status(201).json({
                status: true,
                message: "Device created successfully",
                data: { id: createDevice }
            });
        } catch (error) {
            next(error);
        }
    }

    updateDeviceController = async(
        req: Request<{ deviceId: string }, deviceIdResponse, updateDeviceInput>,
        res: Response<deviceIdResponse>,
        next: NextFunction
    ) => {
        try {
            const updateDevice = await this.deviceService.updateDeviceService(req.params.deviceId, req.body);

            res.status(200).json({
                status: true,
                message: "Device updated successfully",
                data: { id: updateDevice }
            });

        } catch (error) {
            next(error);
        }
    }

    deleteDeviceController = async(
        req: Request<{ deviceId: string }, deviceIdResponse, {}>,
        res: Response<deviceIdResponse>,
        next: NextFunction
    ) => {
        try {
            const deleteDevice = await this.deviceService.deleteDeviceService(req.params.deviceId);

            res.status(200).json({
                status: true,
                message: "Device deleted successfully",
                data: { id: deleteDevice }
            });

        } catch (error) {
            next(error);
        }
    }
}

export default DeviceController;