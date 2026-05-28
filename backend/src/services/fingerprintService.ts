import { MqttClient } from "mqtt";
import { AppError } from "../middlewares/globalErrorMiddleware.js";

class FingerprintService {

    constructor(private mqttClient: MqttClient) {}

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
        fingerprintIndex: number
    ) {

        try {

            const payload = JSON.stringify({
                template_id: fingerprintIndex
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
                message: "Fingerprint deletion started"
            };

        } catch {

            throw new AppError(
                "Failed to publish fingerprint deletion",
                500
            );
        }
    }
}

export default FingerprintService;