"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Required when extending built-in classes
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
