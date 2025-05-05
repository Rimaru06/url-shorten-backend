import { model, Schema } from "mongoose";
const UrlSchema = new Schema({
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
const UrlModel = model("Url", UrlSchema);
export default UrlModel;
