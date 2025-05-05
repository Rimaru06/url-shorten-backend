"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenUrlSchema = void 0;
const zod_1 = require("zod");
exports.shortenUrlSchema = zod_1.z.object({
    originalUrl: zod_1.z.string().url({ message: "Invalid Url formal" })
});
