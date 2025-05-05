import { AppError } from "../utils/AppError";
export const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Something went wrong";
    console.error("Global Error Handler:", err);
    res.status(statusCode).json({ error: message });
};
