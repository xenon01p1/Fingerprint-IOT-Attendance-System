import { AppError } from "../middlewares/globalErrorMiddleware.js";
class FingerprintController {
    fingerprintService;
    constructor(fingerprintService) {
        this.fingerprintService = fingerprintService;
    }
    fingerprintRegister = async (req, res, next) => {
        try {
            const { fingerprintIndex, employeeId, deviceId } = req.body;
            if (!fingerprintIndex || !employeeId || !deviceId) {
                throw new AppError("fingerprintIndex, employeeId, and deviceId are required", 400);
            }
            const result = await this.fingerprintService
                .registerFingerprintService(fingerprintIndex, employeeId, deviceId);
            res.status(201).json({
                status: true,
                message: result.message,
                data: result.data
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteFingerprint = async (req, res, next) => {
        try {
            const { id: fingerprintId } = req.params;
            if (!fingerprintId) {
                throw new AppError("Fingerprint ID is required", 400);
            }
            const result = await this.fingerprintService
                .deleteFingerprintService(fingerprintId);
            res.status(200).json({
                status: true,
                message: result.message,
                data: result.data
            });
        }
        catch (error) {
            next(error);
        }
    };
}
export default FingerprintController;
