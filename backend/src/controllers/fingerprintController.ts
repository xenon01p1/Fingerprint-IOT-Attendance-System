import FingerprintService from "../services/fingerprintService.js";

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

            const { fingerprintIndex } = req.body;

            const result =
                await this.fingerprintService
                    .registerFingerprintService(
                        fingerprintIndex
                    );

            res.status(200).json({
                status: true,
                message: result.message
            });

        } catch (error) {

            next(error);
        }
    };

    deleteFingerprint = async (
        req: Request<{}, {}, DeleteFingerprintInput>,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const { fingerprintIndex } = req.body;

            const result =
                await this.fingerprintService
                    .deleteFingerprintService(
                        fingerprintIndex
                    );

            res.status(200).json({
                status: true,
                message: result.message
            });

        } catch (error) {

            next(error);
        }
    };
}

export default FingerprintController;