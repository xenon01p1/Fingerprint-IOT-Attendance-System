class DeviceController {
    deviceService;
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    // Request(params, response, bod)
    getAllDevicesController = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const result = await this.deviceService.getAllDevicesService(page, pageSize);
            res.status(200).json({
                status: true,
                message: "Devices retrieved successfully",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    createDeviceController = async (req, res, next) => {
        try {
            const createDevice = await this.deviceService.createDeviceService(req.body);
            res.status(201).json({
                status: true,
                message: "Device created successfully",
                data: { id: createDevice }
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateDeviceController = async (req, res, next) => {
        try {
            const updateDevice = await this.deviceService.updateDeviceService(req.params.deviceId, req.body);
            res.status(200).json({
                status: true,
                message: "Device updated successfully",
                data: { id: updateDevice }
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteDeviceController = async (req, res, next) => {
        try {
            const deleteDevice = await this.deviceService.deleteDeviceService(req.params.deviceId);
            res.status(200).json({
                status: true,
                message: "Device deleted successfully",
                data: { id: deleteDevice }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
export default DeviceController;
