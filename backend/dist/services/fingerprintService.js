import { AppError } from "../middlewares/globalErrorMiddleware.js";
class FingerprintService {
    mqttClient;
    fingerprintRepository;
    constructor(mqttClient, fingerprintRepository) {
        this.mqttClient = mqttClient;
        this.fingerprintRepository = fingerprintRepository;
    }
    async registerFingerprintService(fingerprintIndex, employeeId, deviceId) {
        try {
            const existing = await this.fingerprintRepository.findByDeviceAndIndex(deviceId, fingerprintIndex);
            if (existing) {
                throw new AppError("Fingerprint index already registered for this device", 409);
            }
            const fingerprint = await this.fingerprintRepository.createFingerprint({
                fingerPrintIndex: fingerprintIndex,
                employeeId,
                deviceId
            });
            if (!fingerprint) {
                throw new AppError("Failed to save fingerprint to database", 500);
            }
            const payload = JSON.stringify({
                type: "register",
                fingerprintIndex,
                template_id: fingerprintIndex,
                employeeId,
                deviceId
            });
            await new Promise((resolve, reject) => {
                this.mqttClient.publish("sofie/fingerprint/register", payload, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
            return {
                status: true,
                message: "Fingerprint enrollment started",
                data: {
                    id: fingerprint.id,
                    fingerprintIndex: fingerprint.fingerPrintIndex,
                    employeeId: fingerprint.employeeId,
                    deviceId: fingerprint.deviceId
                }
            };
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Failed to register fingerprint", 500);
        }
    }
    async deleteFingerprintService(fingerprintId) {
        try {
            const fingerprint = await this.fingerprintRepository.getFingerprint(fingerprintId);
            if (!fingerprint) {
                throw new AppError("Fingerprint data not found", 404);
            }
            const payload = JSON.stringify({
                type: "delete",
                template_id: fingerprint.fingerPrintIndex,
                fingerprintIndex: fingerprint.fingerPrintIndex,
                deviceId: fingerprint.deviceId,
                fingerprintId: fingerprint.id
            });
            await new Promise((resolve, reject) => {
                this.mqttClient.publish("sofie/fingerprint/delete", payload, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
            // Delete fingerprint from database
            await this.fingerprintRepository.deleteFingerprint(fingerprintId);
            return {
                status: true,
                message: "Fingerprint deleted successfully",
                data: {
                    id: fingerprint.id,
                    fingerprintIndex: fingerprint.fingerPrintIndex,
                    deviceId: fingerprint.deviceId
                }
            };
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Failed to delete fingerprint", 500);
        }
    }
    async getAvailableFingerprintIndexes(deviceId) {
        try {
            console.log("Fetching used indexes for deviceId:", deviceId);
            const usedIndexes = await this.fingerprintRepository.getUsedIndexesByDevice(deviceId);
            console.log("Used indexes:", usedIndexes);
            // Generate all available indexes from 1 to 127
            const allIndexes = Array.from({ length: 127 }, (_, i) => i + 1);
            // Filter out used indexes
            const availableIndexes = allIndexes.filter(index => !usedIndexes.includes(index));
            console.log("Available indexes count:", availableIndexes.length);
            return {
                status: true,
                message: "Available fingerprint indexes retrieved",
                data: {
                    availableIndexes,
                    usedIndexes,
                    totalAvailable: availableIndexes.length
                }
            };
        }
        catch (error) {
            console.error("Error getting available indexes:", error);
            throw new AppError("Failed to retrieve available fingerprint indexes", 500);
        }
    }
}
export default FingerprintService;
