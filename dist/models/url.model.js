"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UrlSchema = new mongoose_1.Schema({
    shortId: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    vistHistory: [
        {
            timestamp: { type: Date, default: Date.now },
            ip: String,
            userAgent: String,
            country: String
        }
    ]
});
const UrlModel = (0, mongoose_1.model)("Url", UrlSchema);
exports.default = UrlModel;
