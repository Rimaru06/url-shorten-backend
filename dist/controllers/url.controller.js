var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UrlModel from "../models/url.model";
import { nanoid } from "nanoid";
import geoip from 'geoip-lite';
import { UAParser } from "ua-parser-js";
import { AppError } from "../utils/AppError";
export const shortenUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const originalUrl = req.body.originalUrl;
    if (!originalUrl) {
        throw new AppError("original url is required", 400);
    }
    //const validation = shortenUrlSchema.safeParse(originalUrl);
    //if(!validation.success) return res.status(400).json({message : validation.error.message});
    const BaseUrl = process.env.BASE_URL;
    const shortId = nanoid(6);
    const shortUrl = `${BaseUrl}/${shortId}`;
    try {
        const newEntry = yield UrlModel.create({
            shortId,
            originalUrl,
            shortUrl
        });
        return res.status(200).json({ shortUrl: newEntry.shortUrl });
    }
    catch (error) {
        throw new AppError("Internal Server Error", 500);
    }
});
export const redirectToOriginalUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortId } = req.params;
    const ip = req.ip;
    const userAgentString = req.headers["user-agent"];
    try {
        const UrlDocs = yield UrlModel.findOne({ shortId });
        if (!UrlDocs)
            throw new AppError("Url not Found", 404);
        const geo = geoip.lookup(ip);
        const country = (geo === null || geo === void 0 ? void 0 : geo.country) || "unknown";
        const parser = UAParser(userAgentString);
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
        throw new AppError("Internal Server Error", 500);
    }
});
export const getUrlStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortId } = req.params;
    try {
        const urlDoc = yield UrlModel.findOne({ shortId });
        if (!urlDoc) {
            throw new AppError("Url not Found", 404);
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
        throw new AppError("Internal Server Error", 500);
    }
});
