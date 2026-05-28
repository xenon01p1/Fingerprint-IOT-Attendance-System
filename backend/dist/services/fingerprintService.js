import { AppError } from "../middlewares/globalErrorMiddleware.js";
class FingerprintService {
    mqttClient;
    constructor(mqttClient) {
        this.mqttClient = mqttClient;
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
    async deleteFingerprintService(fingerprintIndex) {
        try {
            const payload = JSON.stringify({
                template_id: fingerprintIndex
            });
            await new Promise((resolve, reject) => {
                this.mqttClient.publish("sofie/fingerprint/delete", payload, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
            return {
                status: true,
                message: "Fingerprint deletion started"
            };
        }
        catch {
            throw new AppError("Failed to publish fingerprint deletion", 500);
        }
    }
}
export default FingerprintService;
