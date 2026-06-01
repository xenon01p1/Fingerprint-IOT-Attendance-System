import { MqttClient } from "mqtt";
import { AppError } from "../middlewares/globalErrorMiddleware.js";
import FingerprintRepository from "../repositories/fingerprintRepo.js";

class FingerprintService {

    constructor(
        private mqttClient: MqttClient,
        private fingerprintRepository: FingerprintRepository
    ) {}

    async registerFingerprintService(
        fingerprintIndex: number
    ) {

        try {

            const payload = JSON.stringify({
                template_id: fingerprintIndex
            });

            await new Promise<void>((resolve, reject) => {

                this.mqttClient.publish(
                    "sofie/fingerprint/register",
                    payload,
                    (err) => {

                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            return {
                status: true,
                message: "Fingerprint enrollment started"
            };

        } catch {

            throw new AppError(
                "Failed to publish fingerprint registration",
                500
            );
        }
    }

    async deleteFingerprintService(
        fingerprintId: string
    ) {

        try {
            
            const payload = JSON.stringify({
                template_id: fingerprintId
            });

            await new Promise<void>((resolve, reject) => {

                this.mqttClient.publish(
                    "sofie/fingerprint/delete",
                    payload,
                    (err) => {

                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            return {
                status: true,
                message: "Fingerprint deleted successfully",
                data: {
                    id: fingerprintId
                }
            };

        } catch (error) {

            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                "Failed to delete fingerprint",
                500
            );
        }
    }
}

export default FingerprintService;