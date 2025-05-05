import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/connectDB';

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI as string;

const startServer = async () => {
    try {
      if (!MONGO_URI) {
        throw new Error("MongoDB URI not defined in .env");
      }

      await connectDB(MONGO_URI);
      app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error("❌ Failed to start server:", err);
      process.exit(1);
    }
  };
  
  startServer();
  