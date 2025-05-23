"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const url_route_1 = __importDefault(require("./routes/url.route"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/url", url_route_1.default);
const url_controller_1 = require("./controllers/url.controller");
const errorHandler_1 = require("./middlewares/errorHandler");
app.get("/:shortId", url_controller_1.redirectToOriginalUrl);
app.use(errorHandler_1.errorHandler);
exports.default = app;
