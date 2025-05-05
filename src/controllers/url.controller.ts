import {Request , Response } from "express";
import UrlModel from "../models/url.model";
import { nanoid } from "nanoid";
import geoip from 'geoip-lite';
import {UAParser} from "ua-parser-js";
import { shortenUrlSchema } from "../validation/url.validation";
import { AppError } from "../utils/AppError";

export const shortenUrl = async (req : Request,res : Response) : Promise<any> => {
    const originalUrl : string  = req.body.originalUrl;

    if(!originalUrl) {
        throw new AppError("original url is required", 400);
    }

    //const validation = shortenUrlSchema.safeParse(originalUrl);
    //if(!validation.success) return res.status(400).json({message : validation.error.message});

    const BaseUrl = process.env.BASE_URL;

    const shortId  = nanoid(6);

    const shortUrl = `${BaseUrl}/${shortId}`;

    try {
        const newEntry = await UrlModel.create({
            shortId,
            originalUrl,
            shortUrl
        });

        return res.status(200).json({shortUrl : newEntry.shortUrl});
    } catch (error) {
        throw new AppError("Internal Server Error", 500);
    }
}

export const redirectToOriginalUrl = async (req : Request , res : Response) : Promise<any> => {
    const {shortId} = req.params;
    const ip = req.ip as string;
    const userAgentString = req.headers["user-agent"] as string;
    
    try {
        const UrlDocs = await UrlModel.findOne({shortId});

        if(!UrlDocs) throw new AppError("Url not Found", 404); 

        const geo = geoip.lookup(ip);
        const country = geo?.country || "unknown";

        const parser = UAParser(userAgentString);
        const userAgent = `${parser.browser.name} on ${parser.os.name} (${parser.device})`

        UrlDocs.vistHistory.push({
            timestamp : new Date(),
            ip,
            userAgent,
            country
        })
        await UrlDocs.save();
        return res.redirect(UrlDocs.originalUrl);
    } catch (error) {
        throw new AppError("Internal Server Error", 500);
    }
}

export const getUrlStats = async (req: Request, res: Response)  : Promise<any> => {
    const { shortId } = req.params;
  
    try {
      const urlDoc = await UrlModel.findOne({ shortId });
  
      if (!urlDoc) {
        throw new AppError("Url not Found", 404); 
      }
  
      const totalClicks = urlDoc.vistHistory.length;
  
      const countries = urlDoc.vistHistory.reduce((acc, visit) => {
        const country = visit.country || "unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      const devices = urlDoc.vistHistory.reduce((acc, visit) => {
        const userAgent = visit.userAgent || "unknown";
        acc[userAgent] = (acc[userAgent] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      return res.json({
        originalUrl: urlDoc.originalUrl,
        shortUrl: urlDoc.shortUrl,
        totalClicks,
        countries,
        devices,
        visitHistory: urlDoc.vistHistory,
      });
    } catch (err) {
        throw new AppError("Internal Server Error", 500);
    }
  };
  