class LogDeviceController {
    logDeviceService;
    constructor(logDeviceService) {
        this.logDeviceService = logDeviceService;
    }
    getAllLogDeviceController = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const result = await this.logDeviceService.getAllLogDeviceService(page, pageSize);
            res.status(200).json({
                status: true,
                message: "Log device records retrieved successfully",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    getLogDeviceController = async (req, res, next) => {
        try {
            const { logDeviceId } = req.params;
            const logDevice = await this.logDeviceService.getLogDeviceService(logDeviceId);
            res.status(200).json({
                status: true,
                message: "Log device record retrieved successfully",
                data: logDevice
            });
        }
        catch (error) {
            next(error);
        }
    };
    createLogDeviceController = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
}
export default LogDeviceController;
