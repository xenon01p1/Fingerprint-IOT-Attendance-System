export class AppError extends Error {
    message;
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    res.status(statusCode).json({ status: false, message: err.message ?? "System error" });
};
