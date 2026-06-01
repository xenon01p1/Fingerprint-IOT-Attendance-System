import { AppError } from "../middlewares/globalErrorMiddleware.js";
class DeviceService {
    deviceRepo;
    constructor(deviceRepo) {
        this.deviceRepo = deviceRepo;
    }
    async getAllDevicesService(page = 1, pageSize = 10) {
        try {
            const validPage = Math.max(1, page);
            const validPageSize = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
            const skip = (validPage - 1) * validPageSize;
            const take = validPageSize;
            const devicesData = await this.deviceRepo.getAllDevices(skip, take);
            const totalItems = await this.deviceRepo.getDeviceCount();
            if (!Array.isArray(devicesData)) {
                throw new AppError("Failed to retrieve device data", 500);
            }
            const totalPages = Math.ceil(totalItems / validPageSize);
            return {
                items: devicesData.map(device => ({
                    id: device.id,
                    name: device.name,
                    address: device.address,
                    location: device.location,
                    createdAt: device.createdAt,
                    updatedAt: device.updatedAt,
                    companyId: device.companyId,
                    isDeleted: device.isDeleted
                })),
                pagination: {
                    currentPage: validPage,
                    pageSize: validPageSize,
                    totalItems,
                    totalPages
                }
            };
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(error instanceof Error ? error.message : "Failed to retrieve employees", 500);
        }
    }
    async createDeviceService(data) {
        const createdDevice = await this.deviceRepo.createDevice(data);
        if (!createdDevice) {
            throw new AppError("Failed to create device", 500);
        }
        return String(createdDevice.id);
    }
    async updateDeviceService(deviceId, data) {
        const updatedDevice = await this.deviceRepo.updateDevice(deviceId, data);
        if (!updatedDevice) {
            throw new AppError("Failed to update device", 500);
        }
        return updatedDevice.id;
    }
    async deleteDeviceService(deviceId) {
        const deletedDevice = await this.deviceRepo.deleteDevice(deviceId);
        if (!deletedDevice) {
            throw new AppError("Failed to delete device", 500);
        }
        return deletedDevice.id;
    }
}
export default DeviceService;
