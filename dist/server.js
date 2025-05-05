var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/connectDB';
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!MONGO_URI) {
            throw new Error("MongoDB URI not defined in .env");
        }
        yield connectDB(MONGO_URI);
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
});
startServer();
