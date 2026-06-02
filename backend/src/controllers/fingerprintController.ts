import FingerprintService from "../services/fingerprintService.js";
import { AppError } from "../middlewares/globalErrorMiddleware.js";

import type {
    Request,
    Response,
    NextFunction
} from "express";

import type {
    RegisterFingerprintInput,
    DeleteFingerprintInput
} from "../schema/fingerprintSchema.js";

class FingerprintController {

    constructor(
        private fingerprintService: FingerprintService
    ) {}

    fingerprintRegister = async (
        req: Request<{}, {}, RegisterFingerprintInput>,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const { fingerprintIndex, employeeId, deviceId } = req.body;

            if (!fingerprintIndex || !employeeId || !deviceId) {
                throw new AppError(
                    "fingerprintIndex, employeeId, and deviceId are required",
                    400
                );
            }

            const result =
                await this.fingerprintService
                    .registerFingerprintService(
                        fingerprintIndex,
                        employeeId,
                        deviceId
                    );

            res.status(201).json({
                status: true,
                message: result.message,
                data: result.data
            });

        } catch (error) {

            next(error);
        }
    };

    deleteFingerprint = async (
        req: Request<{ id: string }, {}, DeleteFingerprintInput>,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const { id: fingerprintId } = req.params;

            if (!fingerprintId) {
                throw new AppError(
                    "Fingerprint ID is required",
                    400
                );
            }

            const result =
                await this.fingerprintService
                    .deleteFingerprintService(
                        fingerprintId
                    );

            res.status(200).json({
                status: true,
                message: result.message,
                data: result.data
            });

        } catch (error) {

            next(error);
        }
    };
}

export default FingerprintController;