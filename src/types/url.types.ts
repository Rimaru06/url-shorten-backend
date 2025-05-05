export interface IVisitLog {
    timestamp : Date;
    ip : string;
    userAgent? : string;
    country? : string;
}

export interface IUrl {
    shortId : string;
    originalUrl : string;
    shortUrl : string;
    createdAt : Date;
    vistHistory : IVisitLog[];
}