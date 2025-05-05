import express from 'express';
import { shortenUrl,getUrlStats } from '../controllers/url.controller';

const router = express.Router();

router.post("/shorten",shortenUrl);
router.get("/:shortId/stats",getUrlStats)

export default router;