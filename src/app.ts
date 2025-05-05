import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import urlroute from './routes/url.route';

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/url", urlroute);
import { redirectToOriginalUrl } from './controllers/url.controller';
import { errorHandler } from './middlewares/errorHandler';
app.get("/:shortId",redirectToOriginalUrl);

app.use(errorHandler);
export default app;
