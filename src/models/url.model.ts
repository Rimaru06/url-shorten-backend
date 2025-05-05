import { Document , model , Schema } from "mongoose";
import { IUrl } from "../types/url.types";

interface IUrlDocument extends IUrl, Document {}

const UrlSchema = new Schema<IUrlDocument>({
    shortId : {type : String , required : true , unique : true},
    originalUrl : {type : String , required : true},
    shortUrl : {type : String , required : true},
    createdAt : {type : Date , default : Date.now},
    vistHistory : [
        {
            timestamp : {type : Date , default : Date.now},
            ip : String,
            userAgent : String,
            country : String
        }
    ]
})

const UrlModel = model<IUrlDocument>("Url", UrlSchema);
export default UrlModel;