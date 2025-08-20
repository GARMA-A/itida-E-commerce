import express from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/rootRouter.ts";
import mongoose from "mongoose";


dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/E-Commerce";

const app = express();

app.use(express.json());
app.use("/", rootRouter);


mongoose.connect(MONGO_URI)
	.then(() => {
		console.log("✅ MongoDB connected");
		app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
	})
	.catch(err => console.error("❌ DB connection error:", err));
