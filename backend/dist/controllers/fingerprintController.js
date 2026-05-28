class FingerprintController {
    fingerprintService;
    constructor(fingerprintService) {
        this.fingerprintService = fingerprintService;
    }
    fingerprintRegister = async (req, res, next) => {
        try {
            const { fingerprintIndex } = req.body;
            const result = await this.fingerprintService
                .registerFingerprintService(fingerprintIndex);
            res.status(200).json({
                status: true,
                message: result.message
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteFingerprint = async (req, res, next) => {
        try {
            const { fingerprintIndex } = req.body;
            const result = await this.fingerprintService
                .deleteFingerprintService(fingerprintIndex);
            res.status(200).json({
                status: true,
                message: result.message
            });
        }
        catch (error) {
            next(error);
        }
    };
}
export default FingerprintController;
