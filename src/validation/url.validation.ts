import { z } from "zod";
export const shortenUrlSchema = z.object({
    originalUrl : z.string().url({message : "Invalid Url formal"})
})