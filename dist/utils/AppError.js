export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Required when extending built-in classes
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
