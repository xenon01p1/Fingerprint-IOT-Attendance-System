import { AppError } from "../middlewares/globalErrorMiddleware.js";
class FingerprintService {
    mqttClient;
    fingerprintRepository;
    constructor(mqttClient, fingerprintRepository) {
        this.mqttClient = mqttClient;
        this.fingerprintRepository = fingerprintRepository;
    }
    async registerFingerprintService(fingerprintIndex) {
        try {
            const payload = JSON.stringify({
                template_id: fingerprintIndex
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
                message: "Fingerprint enrollment started"
            };
        }
        catch {
            throw new AppError("Failed to publish fingerprint registration", 500);
        }
    }
    async deleteFingerprintService(fingerprintId) {
        try {
            const fingerprint = await this.fingerprintRepository.getFingerprint(fingerprintId);
            if (!fingerprint) {
                throw new AppError("Fingerprint not found", 404);
            }
            const payload = JSON.stringify({
                template_id: fingerprint.fingerPrintIndex
            });
            await new Promise((resolve, reject) => {
                this.mqttClient.publish("sofie/fingerprint/delete", payload, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
            const deletedFingerprint = await this.fingerprintRepository.deleteFingerprint(fingerprintId);
            if (!deletedFingerprint) {
                throw new AppError("Failed to delete fingerprint from database", 500);
            }
            return {
                status: true,
                message: "Fingerprint deleted successfully",
                data: {
                    id: deletedFingerprint.id
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
}
export default FingerprintService;
