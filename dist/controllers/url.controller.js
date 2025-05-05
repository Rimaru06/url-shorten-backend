"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlStats = exports.redirectToOriginalUrl = exports.shortenUrl = void 0;
const url_model_1 = __importDefault(require("../models/url.model"));
const nanoid_1 = require("nanoid");
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const ua_parser_js_1 = require("ua-parser-js");
const AppError_1 = require("../utils/AppError");
const shortenUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const originalUrl = req.body.originalUrl;
    if (!originalUrl) {
        throw new AppError_1.AppError("original url is required", 400);
    }
    //const validation = shortenUrlSchema.safeParse(originalUrl);
    //if(!validation.success) return res.status(400).json({message : validation.error.message});
    const BaseUrl = process.env.BASE_URL;
    const shortId = (0, nanoid_1.nanoid)(6);
    const shortUrl = `${BaseUrl}/${shortId}`;
    try {
        const newEntry = yield url_model_1.default.create({
            shortId,
            originalUrl,
            shortUrl
        });
        return res.status(200).json({ shortUrl: newEntry.shortUrl });
    }
    catch (error) {
        throw new AppError_1.AppError("Internal Server Error", 500);
    }
});
exports.shortenUrl = shortenUrl;
const redirectToOriginalUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortId } = req.params;
    const ip = req.ip;
    const userAgentString = req.headers["user-agent"];
    try {
        const UrlDocs = yield url_model_1.default.findOne({ shortId });
        if (!UrlDocs)
            throw new AppError_1.AppError("Url not Found", 404);
        const geo = geoip_lite_1.default.lookup(ip);
        const country = (geo === null || geo === void 0 ? void 0 : geo.country) || "unknown";
        const parser = (0, ua_parser_js_1.UAParser)(userAgentString);
        const userAgent = `${parser.browser.name} on ${parser.os.name} (${parser.device})`;
        UrlDocs.vistHistory.push({
            timestamp: new Date(),
            ip,
            userAgent,
            country
        });
        yield UrlDocs.save();
        return res.redirect(UrlDocs.originalUrl);
    }
    catch (error) {
        throw new AppError_1.AppError("Internal Server Error", 500);
    }
});
exports.redirectToOriginalUrl = redirectToOriginalUrl;
const getUrlStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortId } = req.params;
    try {
        const urlDoc = yield url_model_1.default.findOne({ shortId });
        if (!urlDoc) {
            throw new AppError_1.AppError("Url not Found", 404);
        }
        const totalClicks = urlDoc.vistHistory.length;
        const countries = urlDoc.vistHistory.reduce((acc, visit) => {
            const country = visit.country || "unknown";
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {});
        const devices = urlDoc.vistHistory.reduce((acc, visit) => {
            const userAgent = visit.userAgent || "unknown";
            acc[userAgent] = (acc[userAgent] || 0) + 1;
            return acc;
        }, {});
        return res.json({
            originalUrl: urlDoc.originalUrl,
            shortUrl: urlDoc.shortUrl,
            totalClicks,
            countries,
            devices,
            visitHistory: urlDoc.vistHistory,
        });
    }
    catch (err) {
        throw new AppError_1.AppError("Internal Server Error", 500);
    }
});
exports.getUrlStats = getUrlStats;
